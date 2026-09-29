<?php
// backend/models/FormSubmission.php

class FormSubmission {
    private $db;
    private $table_name = "form_submissions";
    private $dataFile;

    public function __construct($db) {
        $this->db = $db;
        $this->dataFile = __DIR__ . '/../data/form_submissions.json';
    }

    public function create($data) {
        $form_type = htmlspecialchars(strip_tags($data['form_type'] ?? 'contact'));
        $name = htmlspecialchars(strip_tags($data['name'] ?? $data['surname'] ?? ''));
        $email = htmlspecialchars(strip_tags($data['email'] ?? ''));
        $phone = htmlspecialchars(strip_tags($data['phone'] ?? ''));
        $subject = htmlspecialchars(strip_tags($data['subject'] ?? ''));
        $message = htmlspecialchars(strip_tags($data['message'] ?? ''));
        $formData = !empty($data['form_data']) ? json_encode($data['form_data']) : json_encode($data);
        $status = 'new';
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $now = date('Y-m-d H:i:s');

        if ($this->db instanceof PDO) {
            $query = "INSERT INTO " . $this->table_name . " 
                      (form_type, name, email, phone, subject, message, form_data, status, ip_address, user_agent, created_at, updated_at) 
                      VALUES (:form_type, :name, :email, :phone, :subject, :message, :form_data, :status, :ip, :ua, :created_at, :updated_at)";

            $stmt = $this->db->prepare($query);
            $stmt->bindParam(':form_type', $form_type);
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':phone', $phone);
            $stmt->bindParam(':subject', $subject);
            $stmt->bindParam(':message', $message);
            $stmt->bindParam(':form_data', $formData);
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':ip', $ip);
            $stmt->bindParam(':ua', $ua);
            $stmt->bindParam(':created_at', $now);
            $stmt->bindParam(':updated_at', $now);

            if ($stmt->execute()) {
                return (int)$this->db->lastInsertId();
            }
            return false;
        } else {
            $submissions = [];
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
            }
            $newId = count($submissions) > 0 ? (max(array_column($submissions, 'id')) + 1) : 1;
            $newSub = [
                'id' => $newId,
                'form_type' => $form_type,
                'name' => $name,
                'email' => $email,
                'phone' => $phone,
                'subject' => $subject,
                'message' => $message,
                'form_data' => is_string($formData) ? json_decode($formData, true) : $formData,
                'status' => $status,
                'notes' => '',
                'ip_address' => $ip,
                'user_agent' => $ua,
                'created_at' => $now,
                'updated_at' => $now
            ];
            $submissions[] = $newSub;
            file_put_contents($this->dataFile, json_encode($submissions, JSON_PRETTY_PRINT));
            return $newId;
        }
    }

    public function getAll($params = []) {
        $search = trim($params['search'] ?? '');
        $status = trim($params['status'] ?? '');
        $formType = trim($params['form_type'] ?? '');
        $page = max(1, (int)($params['page'] ?? 1));
        $limit = max(1, min(100, (int)($params['limit'] ?? 15)));
        $offset = ($page - 1) * $limit;
        $sortBy = in_array($params['sort_by'] ?? '', ['id', 'name', 'email', 'form_type', 'status', 'created_at']) ? $params['sort_by'] : 'created_at';
        $sortOrder = strtoupper($params['sort_order'] ?? '') === 'ASC' ? 'ASC' : 'DESC';

        if ($this->db instanceof PDO) {
            $where = [];
            $binds = [];

            if (!empty($search)) {
                $where[] = "(name LIKE :search OR email LIKE :search OR message LIKE :search OR phone LIKE :search)";
                $binds[':search'] = "%{$search}%";
            }
            if (!empty($status)) {
                $where[] = "status = :status";
                $binds[':status'] = $status;
            }
            if (!empty($formType)) {
                $where[] = "form_type = :form_type";
                $binds[':form_type'] = $formType;
            }

            $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

            // Total count
            $countStmt = $this->db->prepare("SELECT COUNT(*) as total FROM " . $this->table_name . " {$whereSql}");
            foreach ($binds as $k => $v) {
                $countStmt->bindValue($k, $v);
            }
            $countStmt->execute();
            $total = (int)$countStmt->fetch()['total'];

            // Items
            $sql = "SELECT * FROM " . $this->table_name . " {$whereSql} ORDER BY {$sortBy} {$sortOrder} LIMIT :limit OFFSET :offset";
            $stmt = $this->db->prepare($sql);
            foreach ($binds as $k => $v) {
                $stmt->bindValue($k, $v);
            }
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

            foreach ($items as &$item) {
                if (is_string($item['form_data'])) {
                    $item['form_data'] = json_decode($item['form_data'], true) ?: [];
                }
            }

            return [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit),
                'items' => $items
            ];
        } else {
            $submissions = [];
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
            }

            // Filtering
            $filtered = array_filter($submissions, function($sub) use ($search, $status, $formType) {
                if (!empty($status) && $sub['status'] !== $status) return false;
                if (!empty($formType) && $sub['form_type'] !== $formType) return false;
                if (!empty($search)) {
                    $haystack = strtolower($sub['name'] . ' ' . $sub['email'] . ' ' . ($sub['phone'] ?? '') . ' ' . $sub['message']);
                    if (strpos($haystack, strtolower($search)) === false) return false;
                }
                return true;
            });

            // Sorting
            usort($filtered, function($a, $b) use ($sortBy, $sortOrder) {
                $vA = $a[$sortBy] ?? '';
                $vB = $b[$sortBy] ?? '';
                if ($sortOrder === 'ASC') {
                    return $vA <=> $vB;
                }
                return $vB <=> $vA;
            });

            $total = count($filtered);
            $paged = array_slice($filtered, $offset, $limit);

            return [
                'total' => $total,
                'page' => $page,
                'limit' => $limit,
                'total_pages' => ceil($total / $limit),
                'items' => array_values($paged)
            ];
        }
    }

    public function findById($id) {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("SELECT * FROM " . $this->table_name . " WHERE id = :id LIMIT 1");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $item = $stmt->fetch(PDO::FETCH_ASSOC);
            if ($item && is_string($item['form_data'])) {
                $item['form_data'] = json_decode($item['form_data'], true) ?: [];
            }
            return $item;
        } else {
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
                foreach ($submissions as $sub) {
                    if ($sub['id'] == $id) {
                        return $sub;
                    }
                }
            }
        }
        return null;
    }

    public function updateStatus($id, $status, $notes = null) {
        $allowedStatuses = ['new', 'read', 'replied', 'archived'];
        if (!in_array($status, $allowedStatuses)) {
            return false;
        }

        $now = date('Y-m-d H:i:s');

        if ($this->db instanceof PDO) {
            if ($notes !== null) {
                $stmt = $this->db->prepare("UPDATE " . $this->table_name . " SET status = :status, notes = :notes, updated_at = :updated_at WHERE id = :id");
                $stmt->bindParam(':notes', $notes);
            } else {
                $stmt = $this->db->prepare("UPDATE " . $this->table_name . " SET status = :status, updated_at = :updated_at WHERE id = :id");
            }
            $stmt->bindParam(':status', $status);
            $stmt->bindParam(':updated_at', $now);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } else {
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
                foreach ($submissions as &$sub) {
                    if ($sub['id'] == $id) {
                        $sub['status'] = $status;
                        if ($notes !== null) {
                            $sub['notes'] = $notes;
                        }
                        $sub['updated_at'] = $now;
                        file_put_contents($this->dataFile, json_encode($submissions, JSON_PRETTY_PRINT));
                        return true;
                    }
                }
            }
        }
        return false;
    }

    public function delete($id) {
        if ($this->db instanceof PDO) {
            $stmt = $this->db->prepare("DELETE FROM " . $this->table_name . " WHERE id = :id");
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            return $stmt->execute();
        } else {
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
                $filtered = array_filter($submissions, fn($s) => $s['id'] != $id);
                file_put_contents($this->dataFile, json_encode(array_values($filtered), JSON_PRETTY_PRINT));
                return true;
            }
        }
        return false;
    }

    public function getStatistics() {
        $today = date('Y-m-d');
        $thisMonth = date('Y-m');

        if ($this->db instanceof PDO) {
            $total = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name)->fetchColumn();
            $new = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE status = 'new'")->fetchColumn();
            $read = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE status = 'read'")->fetchColumn();
            $replied = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE status = 'replied'")->fetchColumn();
            
            $todayCount = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE DATE(created_at) = '{$today}'")->fetchColumn();
            $thisMonthCount = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE DATE_FORMAT(created_at, '%Y-%m') = '{$thisMonth}'")->fetchColumn();

            // Recent 7 days chart data
            $chartData = [];
            for ($i = 6; $i >= 0; $i--) {
                $d = date('Y-m-d', strtotime("-{$i} days"));
                $c = (int)$this->db->query("SELECT COUNT(*) FROM " . $this->table_name . " WHERE DATE(created_at) = '{$d}'")->fetchColumn();
                $chartData[] = [
                    'date' => date('M d', strtotime($d)),
                    'count' => $c
                ];
            }

            return [
                'total_submissions' => $total,
                'new_submissions' => $new,
                'read_submissions' => $read,
                'replied_submissions' => $replied,
                'today_submissions' => $todayCount,
                'this_month_submissions' => $thisMonthCount,
                'timeline_chart' => $chartData
            ];
        } else {
            $submissions = [];
            if (file_exists($this->dataFile)) {
                $submissions = json_decode(file_get_contents($this->dataFile), true) ?: [];
            }

            $total = count($submissions);
            $new = 0;
            $read = 0;
            $replied = 0;
            $todayCount = 0;
            $thisMonthCount = 0;

            foreach ($submissions as $s) {
                if (($s['status'] ?? 'new') === 'new') $new++;
                if (($s['status'] ?? '') === 'read') $read++;
                if (($s['status'] ?? '') === 'replied') $replied++;

                $sDate = substr($s['created_at'] ?? '', 0, 10);
                if ($sDate === $today) $todayCount++;
                if (substr($sDate, 0, 7) === $thisMonth) $thisMonthCount++;
            }

            $chartData = [];
            for ($i = 6; $i >= 0; $i--) {
                $d = date('Y-m-d', strtotime("-{$i} days"));
                $c = 0;
                foreach ($submissions as $s) {
                    if (substr($s['created_at'] ?? '', 0, 10) === $d) $c++;
                }
                $chartData[] = [
                    'date' => date('M d', strtotime($d)),
                    'count' => $c
                ];
            }

            return [
                'total_submissions' => $total,
                'new_submissions' => $new,
                'read_submissions' => $read,
                'replied_submissions' => $replied,
                'today_submissions' => $todayCount,
                'this_month_submissions' => $thisMonthCount,
                'timeline_chart' => $chartData
            ];
        }
    }
}
