<?php
// backend/models/Contact.php

class Contact {
    private $db;
    private $table_name = "contacts";
    private $dataFile;

    public $id;
    public $surname;
    public $email;
    public $country;
    public $city;
    public $address;
    public $message;
    public $created_at;

    public function __construct($db) {
        $this->db = $db;
        $this->dataFile = __DIR__ . '/../data/contacts.json';
    }

    public function create() {
        $this->surname = htmlspecialchars(strip_tags($this->surname));
        $this->email = htmlspecialchars(strip_tags($this->email));
        $this->country = htmlspecialchars(strip_tags($this->country ?? ''));
        $this->city = htmlspecialchars(strip_tags($this->city ?? ''));
        $this->address = htmlspecialchars(strip_tags($this->address ?? ''));
        $this->message = htmlspecialchars(strip_tags($this->message));
        $this->created_at = date('Y-m-d H:i:s');

        if ($this->db instanceof PDO) {
            $query = "INSERT INTO " . $this->table_name . " 
                      (surname, email, country, city, address, message, created_at) 
                      VALUES (:surname, :email, :country, :city, :address, :message, :created_at)";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(":surname", $this->surname);
            $stmt->bindParam(":email", $this->email);
            $stmt->bindParam(":country", $this->country);
            $stmt->bindParam(":city", $this->city);
            $stmt->bindParam(":address", $this->address);
            $stmt->bindParam(":message", $this->message);
            $stmt->bindParam(":created_at", $this->created_at);

            return $stmt->execute();
        } else {
            // File JSON fallback
            $contacts = [];
            if (file_exists($this->dataFile)) {
                $raw = file_get_contents($this->dataFile);
                $contacts = json_decode($raw, true) ?: [];
            }
            $newContact = [
                'id' => count($contacts) + 1,
                'surname' => $this->surname,
                'email' => $this->email,
                'country' => $this->country,
                'city' => $this->city,
                'address' => $this->address,
                'message' => $this->message,
                'created_at' => $this->created_at
            ];
            $contacts[] = $newContact;
            return file_put_contents($this->dataFile, json_encode($contacts, JSON_PRETTY_PRINT)) !== false;
        }
    }

    public function readAll() {
        if ($this->db instanceof PDO) {
            $query = "SELECT * FROM " . $this->table_name . " ORDER BY id DESC";
            $stmt = $this->db->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            if (file_exists($this->dataFile)) {
                $raw = file_get_contents($this->dataFile);
                $contacts = json_decode($raw, true) ?: [];
                return array_reverse($contacts);
            }
            return [];
        }
    }
}
