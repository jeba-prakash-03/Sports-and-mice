<?php
// backend/services/EmailService.php
require_once __DIR__ . '/SmtpMailer.php';

class EmailService {
    // Fallback SMTP configuration, used only when no SMTP settings have been
    // configured via the Admin Settings screen or SMTP_* environment variables.
    // Never put real credentials here — this is a committed source file.
    private static $defaultSmtp = [
        'host' => 'smtp.example.com',
        'port' => 587,
        'user' => '',
        'pass' => '',
        'from_email' => 'no-reply@sportsandmice.com',
        'from_name' => 'Sports & MICE',
        'admin_email' => 'contact@sportsandmice.com'
    ];

    private static function getMailer($settings = []) {
        $host = !empty($settings['smtp_host']) ? $settings['smtp_host'] : (getenv('SMTP_HOST') ?: self::$defaultSmtp['host']);
        $port = !empty($settings['smtp_port']) ? (int)$settings['smtp_port'] : (int)(getenv('SMTP_PORT') ?: self::$defaultSmtp['port']);
        $user = !empty($settings['smtp_user']) ? $settings['smtp_user'] : (getenv('SMTP_USER') ?: self::$defaultSmtp['user']);
        $pass = !empty($settings['smtp_pass']) ? $settings['smtp_pass'] : (getenv('SMTP_PASS') ?: self::$defaultSmtp['pass']);
        $fromEmail = !empty($settings['smtp_from']) ? $settings['smtp_from'] : (getenv('SMTP_FROM') ?: self::$defaultSmtp['from_email']);
        $fromName = !empty($settings['smtp_from_name']) ? $settings['smtp_from_name'] : self::$defaultSmtp['from_name'];

        return new SmtpMailer($host, $port, $user, $pass, $fromEmail, $fromName);
    }

    /**
     * SMTP is considered "configured" only when real credentials exist
     * (settings table/file or SMTP_USER+SMTP_PASS env vars). Without
     * credentials we skip sending instead of silently failing against
     * smtp.example.com, so submissions are never lost or blocked on email.
     */
    private static function isConfigured($settings = []) {
        $user = $settings['smtp_user'] ?? getenv('SMTP_USER');
        $pass = $settings['smtp_pass'] ?? getenv('SMTP_PASS');
        return !empty($user) && !empty($pass);
    }

    /**
     * Send email to Admin with new form submission details
     */
    public static function sendAdminNotification($submission, $settings = []) {
        if (!self::isConfigured($settings)) {
            error_log('EmailService: SMTP not configured (set it under Admin > Settings or SMTP_USER/SMTP_PASS env vars) — skipping admin notification.');
            return ['success' => false, 'error' => 'SMTP not configured'];
        }

        $adminEmail = !empty($settings['admin_notification_email']) ? $settings['admin_notification_email'] : self::$defaultSmtp['admin_email'];
        $siteName = $settings['site_name'] ?? 'Sports & MICE';

        $subject = "🔔 New Form Submission Received from {$submission['name']}";

        $formDataHtml = "";
        if (!empty($submission['form_data']) && is_array($submission['form_data'])) {
            foreach ($submission['form_data'] as $k => $v) {
                if (!empty($v) && !in_array($k, ['surname', 'name', 'email', 'message', 'website_hp'])) {
                    $label = ucfirst(str_replace('_', ' ', $k));
                    $formDataHtml .= "<tr><td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;width:150px;background-color:#f8fafc;'>{$label}:</td><td style='padding:10px 14px;color:#1e293b;border-bottom:1px solid #f1f5f9;'>" . htmlspecialchars($v) . "</td></tr>";
                }
            }
        }

        $messageHtml = "
        <div style='font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background-color:#ffffff;'>
            <div style='background-color:#106cc2;color:#ffffff;padding:24px;text-align:center;'>
                <h2 style='margin:0;font-size:22px;color:#ffffff;font-weight:700;'>New Website Form Submission</h2>
                <p style='margin:6px 0 0 0;font-size:14px;color:#e0f2fe;'>Sports &amp; MICE Notification System</p>
            </div>
            <div style='padding:28px 24px;'>
                <p style='font-size:15px;color:#334155;margin:0 0 20px 0;'>
                    A visitor has submitted a new inquiry form on the website. Here are the submission details:
                </p>

                <table style='width:100%;border-collapse:collapse;font-size:14px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;'>
                    <tr>
                        <td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;width:150px;background-color:#f8fafc;'>Form Type:</td>
                        <td style='padding:10px 14px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:bold;text-transform:capitalize;'>" . htmlspecialchars($submission['form_type']) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;background-color:#f8fafc;'>Visitor Name:</td>
                        <td style='padding:10px 14px;color:#1e293b;border-bottom:1px solid #f1f5f9;font-weight:600;'>" . htmlspecialchars($submission['name']) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;background-color:#f8fafc;'>Email Address:</td>
                        <td style='padding:10px 14px;color:#106cc2;border-bottom:1px solid #f1f5f9;'><a href='mailto:" . htmlspecialchars($submission['email']) . "' style='color:#106cc2;text-decoration:none;font-weight:600;'>" . htmlspecialchars($submission['email']) . "</a></td>
                    </tr>
                    " . (!empty($submission['phone']) ? "<tr><td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;background-color:#f8fafc;'>Phone:</td><td style='padding:10px 14px;color:#1e293b;border-bottom:1px solid #f1f5f9;'>" . htmlspecialchars($submission['phone']) . "</td></tr>" : "") . "
                    {$formDataHtml}
                    <tr>
                        <td style='padding:10px 14px;font-weight:bold;color:#475569;border-bottom:1px solid #f1f5f9;background-color:#f8fafc;vertical-align:top;'>Message:</td>
                        <td style='padding:10px 14px;color:#1e293b;border-bottom:1px solid #f1f5f9;line-height:1.6;white-space:pre-wrap;'>" . nl2br(htmlspecialchars($submission['message'])) . "</td>
                    </tr>
                    <tr>
                        <td style='padding:10px 14px;font-weight:bold;color:#475569;background-color:#f8fafc;'>Submitted At:</td>
                        <td style='padding:10px 14px;color:#64748b;'>" . date('Y-m-d H:i:s') . "</td>
                    </tr>
                </table>

                <div style='margin-top:24px;text-align:center;'>
                    <a href='http://localhost:5173/admin/forms' style='display:inline-block;background-color:#106cc2;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-weight:bold;font-size:14px;box-shadow:0 2px 4px rgba(0,0,0,0.1);'>
                        View in Admin Panel &rarr;
                    </a>
                </div>
            </div>
            <div style='background-color:#f8fafc;padding:16px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;'>
                © " . date('Y') . " {$siteName}. All rights reserved.
            </div>
        </div>
        ";

        $mailer = self::getMailer($settings);
        return $mailer->send($adminEmail, $subject, $messageHtml);
    }

    /**
     * Send formal confirmation email to the User / Visitor
     */
    public static function sendVisitorAcknowledgement($submission, $settings = []) {
        if (!self::isConfigured($settings)) {
            error_log('EmailService: SMTP not configured (set it under Admin > Settings or SMTP_USER/SMTP_PASS env vars) — skipping visitor acknowledgement.');
            return ['success' => false, 'error' => 'SMTP not configured'];
        }

        $visitorEmail = $submission['email'];
        if (empty($visitorEmail) || !filter_var($visitorEmail, FILTER_VALIDATE_EMAIL)) {
            return false;
        }

        $companyName = $settings['company_name'] ?? 'K-Consulting Sports & MICE';
        $siteName = $settings['site_name'] ?? 'Sports & MICE';

        $subject = "Thank you for contacting {$companyName} - Inquiry Confirmation";

        $messageHtml = "
        <div style='font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;background-color:#ffffff;'>
            <div style='background-color:#212121;color:#ffffff;padding:26px;text-align:center;'>
                <h1 style='margin:0;font-size:24px;color:#ffffff;font-weight:800;letter-spacing:-0.3px;'>Sports &amp; MICE</h1>
                <p style='margin:6px 0 0 0;font-size:13px;color:#cbd5e1;'>K-Consulting</p>
            </div>
            <div style='padding:32px 26px;'>
                <h2 style='margin:0 0 16px 0;font-size:18px;color:#0f172a;'>Dear " . htmlspecialchars($submission['name']) . ",</h2>
                
                <p style='font-size:15px;color:#334155;line-height:1.65;margin:0 0 16px 0;'>
                    Thank you for reaching out to us. We have received your request and inquiry successfully.
                </p>

                <p style='font-size:15px;color:#334155;line-height:1.65;margin:0 0 20px 0;'>
                    Our team is reviewing your requirements and we will contact you shortly with the appropriate information and proposals.
                </p>

                <div style='background-color:#f8fafc;border-left:4px solid #106cc2;border-radius:0 6px 6px 0;padding:16px 18px;margin:24px 0;'>
                    <h3 style='margin:0 0 8px 0;font-size:14px;color:#0f172a;font-weight:700;'>Summary of your submission:</h3>
                    <p style='margin:0;font-size:14px;color:#475569;line-height:1.6;font-style:italic;'>
                        \"" . nl2br(htmlspecialchars($submission['message'])) . "\"
                    </p>
                </div>

                <p style='font-size:14.5px;color:#334155;line-height:1.65;margin:24px 0 0 0;'>
                    Best regards,<br/>
                    <strong>Your K-Consulting Team Sports &amp; MICE</strong>
                </p>

                <div style='margin-top:20px;padding-top:16px;border-top:1px solid #f1f5f9;font-size:13px;color:#64748b;line-height:1.5;'>
                    <strong>K-Consulting Sports &amp; MICE</strong><br/>
                    Marc Knuelle<br/>
                    Fritz-Pullig-Strasse 9, 53757 Sankt Augustin, Germany<br/>
                    Phone: +49 2241 343320 | E-Mail: contact@sportsandmice.com
                </div>
            </div>
            <div style='background-color:#f8fafc;padding:14px;text-align:center;font-size:12px;color:#94a3b8;border-top:1px solid #e2e8f0;'>
                © " . date('Y') . " {$siteName}. All rights reserved.
            </div>
        </div>
        ";

        $mailer = self::getMailer($settings);
        return $mailer->send($visitorEmail, $subject, $messageHtml);
    }
}
