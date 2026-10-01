<?php
// backend/models/User.php

class User {
    private $db;
    private $dataFile;

    public function __construct($db) {
        $this->db = $db;
        $this->dataFile = __DIR__ . '/../data/users.json';
    }

    public function authenticate($email, $password) {
        $loginInput = trim(strtolower($email));
        if (empty($loginInput) || empty($password)) {
            return false;
        }

        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("SELECT * FROM users WHERE LOWER(email) = :input1 OR LOWER(name) = :input2 LIMIT 1");
            $stmt->bindParam(':input1', $loginInput);
            $stmt->bindParam(':input2', $loginInput);
            $stmt->execute();
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password_hash'])) {
                unset($user['password_hash']);
                return $user;
            }
            return false;
        }

        // File JSON fallback (used only when no database connection is available)
        if (file_exists($this->dataFile)) {
            $users = json_decode(file_get_contents($this->dataFile), true) ?: [];
            foreach ($users as $u) {
                $userEmail = strtolower($u['email'] ?? '');
                $userName = strtolower($u['name'] ?? '');
                $matchesUser = ($userEmail === $loginInput || $userName === $loginInput);

                if ($matchesUser && password_verify($password, $u['password_hash'] ?? '')) {
                    unset($u['password_hash']);
                    return $u;
                }
            }
        }

        return false;
    }

    public function findById($id) {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("SELECT id, name, email, role, created_at, updated_at FROM users WHERE id = :id LIMIT 1");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            if (file_exists($this->dataFile)) {
                $users = json_decode(file_get_contents($this->dataFile), true) ?: [];
                foreach ($users as $u) {
                    if ($u['id'] == $id) {
                        unset($u['password_hash']);
                        return $u;
                    }
                }
            }
        }
        return null;
    }

    public function updateProfile($id, $name, $email, $newPassword = null) {
        $name = htmlspecialchars(strip_tags(trim($name)));
        $email = htmlspecialchars(strip_tags(trim(strtolower($email))));

        if ($this->db instanceof PDO) {
            if (!empty($newPassword)) {
                $hash = password_hash($newPassword, PASSWORD_BCRYPT);
                $stmt = $this->db->prepare("UPDATE users SET name = :name, email = :email, password_hash = :hash WHERE id = :id");
                $stmt->bindParam(':hash', $hash);
            } else {
                $stmt = $this->db->prepare("UPDATE users SET name = :name, email = :email WHERE id = :id");
            }
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } else {
            if (file_exists($this->dataFile)) {
                $users = json_decode(file_get_contents($this->dataFile), true) ?: [];
                foreach ($users as &$u) {
                    if ($u['id'] == $id) {
                        $u['name'] = $name;
                        $u['email'] = $email;
                        if (!empty($newPassword)) {
                            $u['password_hash'] = password_hash($newPassword, PASSWORD_BCRYPT);
                        }
                        $u['updated_at'] = date('Y-m-d H:i:s');
                        file_put_contents($this->dataFile, json_encode($users, JSON_PRETTY_PRINT));
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
