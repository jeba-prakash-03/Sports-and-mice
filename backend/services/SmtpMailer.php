<?php
// backend/services/SmtpMailer.php

class SmtpMailer {
    private $host;
    private $port;
    private $username;
    private $password;
    private $fromEmail;
    private $fromName;
    private $timeout = 6;

    public function __construct($host, $port, $username, $password, $fromEmail, $fromName = 'Sports & MICE') {
        $this->host = $host ?: 'smtp.example.com';
        $this->port = (int)($port ?: 587);
        $this->username = $username ?: '';
        // Clean any spaces from Google App Password if present
        $this->password = str_replace(' ', '', $password ?: '');
        $this->fromEmail = $fromEmail ?: 'no-reply@sportsandmice.com';
        $this->fromName = $fromName ?: 'Sports & MICE';
    }

    public function send($to, $subject, $htmlBody, $plainText = '') {
        $logDir = __DIR__ . '/../logs';
        if (!is_dir($logDir)) {
            mkdir($logDir, 0777, true);
        }

        try {
            $socket = @stream_socket_client("tcp://{$this->host}:{$this->port}", $errno, $errstr, $this->timeout);
            if (!$socket) {
                throw new Exception("Could not connect to SMTP host {$this->host}:{$this->port} - {$errstr} ({$errno})");
            }

            stream_set_timeout($socket, $this->timeout);
            $this->readResponse($socket);

            // EHLO
            $this->sendCommand($socket, "EHLO " . gethostname());

            // STARTTLS if port 587
            if ($this->port == 587) {
                $this->sendCommand($socket, "STARTTLS");
                $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
                if (defined('STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT')) {
                    $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT;
                }
                if (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT')) {
                    $cryptoMethod |= STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT;
                }

                if (!@stream_socket_enable_crypto($socket, true, $cryptoMethod)) {
                    throw new Exception("Failed to enable TLS encryption on SMTP connection.");
                }

                $this->sendCommand($socket, "EHLO " . gethostname());
            }

            // AUTH LOGIN
            $this->sendCommand($socket, "AUTH LOGIN");
            $this->sendCommand($socket, base64_encode($this->username));
            $this->sendCommand($socket, base64_encode($this->password));

            // MAIL FROM & RCPT TO
            $this->sendCommand($socket, "MAIL FROM:<{$this->fromEmail}>");
            $this->sendCommand($socket, "RCPT TO:<{$to}>");

            // DATA
            $this->sendCommand($socket, "DATA");

            // Headers & Body
            $boundary = "----=_Part_" . md5(uniqid());
            $headers = [];
            $headers[] = "MIME-Version: 1.0";
            $headers[] = "From: =?UTF-8?B?" . base64_encode($this->fromName) . "?= <{$this->fromEmail}>";
            $headers[] = "To: <{$to}>";
            $headers[] = "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=";
            $headers[] = "Date: " . date('r');
            $headers[] = "Content-Type: multipart/alternative; boundary=\"{$boundary}\"";
            $headers[] = "X-Mailer: Sports & MICE PHP Mailer";

            $body = implode("\r\n", $headers) . "\r\n\r\n";

            // Plain text part
            $plainText = $plainText ?: strip_tags($htmlBody);
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/plain; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($plainText)) . "\r\n";

            // HTML part
            $body .= "--{$boundary}\r\n";
            $body .= "Content-Type: text/html; charset=UTF-8\r\n";
            $body .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $body .= chunk_split(base64_encode($htmlBody)) . "\r\n";

            $body .= "--{$boundary}--\r\n.\r\n";

            fwrite($socket, $body);
            $resp = $this->readResponse($socket);

            $this->sendCommand($socket, "QUIT");
            fclose($socket);

            $logEntry = "[" . date('Y-m-d H:i:s') . "] SMTP SUCCESS -> TO: {$to} | SUBJECT: {$subject}\n";
            file_put_contents($logDir . '/email.log', $logEntry, FILE_APPEND);

            return ['success' => true, 'response' => $resp];
        } catch (Exception $e) {
            $logEntry = "[" . date('Y-m-d H:i:s') . "] SMTP ERROR -> TO: {$to} | ERROR: " . $e->getMessage() . "\n";
            file_put_contents($logDir . '/email.log', $logEntry, FILE_APPEND);
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function sendCommand($socket, $cmd) {
        fwrite($socket, $cmd . "\r\n");
        $res = $this->readResponse($socket);
        $code = (int)substr($res, 0, 3);
        if ($code >= 400) {
            throw new Exception("SMTP command '{$cmd}' rejected: {$res}");
        }
        return $res;
    }

    private function readResponse($socket) {
        $response = "";
        while ($line = fgets($socket, 515)) {
            $response .= $line;
            if (substr($line, 3, 1) === " ") {
                break;
            }
        }
        return trim($response);
    }
}
