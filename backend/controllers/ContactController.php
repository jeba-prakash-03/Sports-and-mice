<?php
// backend/controllers/ContactController.php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../models/Contact.php';
require_once __DIR__ . '/../models/FormSubmission.php';
require_once __DIR__ . '/../models/Setting.php';
require_once __DIR__ . '/../services/EmailService.php';

class ContactController {
    private $db;
    private $contact;
    private $submission;
    private $setting;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
        if ($this->db) {
            $this->contact = new Contact($this->db);
            $this->submission = new FormSubmission($this->db);
            $this->setting = new Setting($this->db);
        }
    }

    public function submit($data) {
        if (!$this->db) {
            return [
                'status' => 500,
                'response' => [
                    'success' => false,
                    'error' => 'Database connection failed.'
                ]
            ];
        }

        // Spam honeypot check (if bot filled hidden honeypot field)
        if (!empty($data['website_hp'])) {
            return [
                'status' => 200,
                'response' => [
                    'success' => true,
                    'message' => 'Your request has been submitted successfully.'
                ]
            ];
        }

        // Validate required fields
        $surname = trim($data['surname'] ?? $data['name'] ?? '');
        $email = trim($data['email'] ?? '');
        $message = trim($data['message'] ?? '');
        $country = trim($data['country'] ?? '');
        $city = trim($data['city'] ?? '');
        $address = trim($data['address'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $subject = trim($data['subject'] ?? 'Website Contact Form Inquiry');
        $formType = trim($data['form_type'] ?? 'contact');

        if (empty($surname) || empty($email) || empty($message)) {
            return [
                'status' => 400,
                'response' => [
                    'success' => false,
                    'error' => 'Please fill in all required fields (Name/Surname, E-mail, Message).'
                ]
            ];
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return [
                'status' => 400,
                'response' => [
                    'success' => false,
                    'error' => 'Please provide a valid e-mail address.'
                ]
            ];
        }

        // Save into FormSubmission model
        $submissionData = [
            'form_type' => $formType,
            'name' => $surname,
            'email' => $email,
            'phone' => $phone,
            'subject' => $subject,
            'message' => $message,
            'form_data' => [
                'country' => $country,
                'city' => $city,
                'address' => $address,
                'phone' => $phone
            ]
        ];

        $submissionId = $this->submission->create($submissionData);

        // Also save to legacy contacts model for compatibility
        $this->contact->surname = $surname;
        $this->contact->email = $email;
        $this->contact->country = $country;
        $this->contact->city = $city;
        $this->contact->address = $address;
        $this->contact->message = $message;
        $this->contact->create();

        // Send Email Notifications (Fault-tolerant: database record is already committed!)
        try {
            $settings = $this->setting->getAll();
            if (($settings['email_notifications_enabled'] ?? 'true') === 'true') {
                EmailService::sendAdminNotification([
                    'form_type' => $formType,
                    'name' => $surname,
                    'email' => $email,
                    'phone' => $phone,
                    'subject' => $subject,
                    'message' => $message,
                    'form_data' => $submissionData['form_data']
                ], $settings);
            }

            if (($settings['visitor_autoresponder_enabled'] ?? 'true') === 'true') {
                EmailService::sendVisitorAcknowledgement([
                    'name' => $surname,
                    'email' => $email,
                    'message' => $message
                ], $settings);
            }
        } catch (Throwable $e) {
            error_log("Email notification error in ContactController: " . $e->getMessage());
        }

        return [
            'status' => 201,
            'response' => [
                'success' => true,
                'submission_id' => $submissionId,
                'message' => 'Thank you! Your request has been submitted successfully. Our team will contact you shortly.'
            ]
        ];
    }

    public function getAll() {
        if (!$this->db) {
            return [
                'status' => 500,
                'response' => [
                    'success' => false,
                    'error' => 'Database connection failed.'
                ]
            ];
        }

        $contacts = $this->contact->readAll();
        return [
            'status' => 200,
            'response' => [
                'success' => true,
                'data' => $contacts
            ]
        ];
    }
}
