<?php
require 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case 'save':
        $lower = $data['lower_bound'] !== '' ? $data['lower_bound'] : null;
        $upper = $data['upper_bound'] !== '' ? $data['upper_bound'] : null;
        $predikat = $data['predikat'] ?? '';

        $stmt = $conn->prepare("INSERT INTO grade_ranges (lower_bound, upper_bound, predikat) VALUES (?, ?, ?)");
        $stmt->bind_param("dds", $lower, $upper, $predikat);
        $success = $stmt->execute();

        echo json_encode(['success' => $success]);
        break;

    case 'delete':
        $id = $data['id'] ?? null;
        if ($id) {
            $stmt = $conn->prepare("DELETE FROM grade_ranges WHERE id = ?");
            $stmt->bind_param("i", $id);
            $success = $stmt->execute();
            echo json_encode(['success' => $success]);
        } else {
            echo json_encode(['success' => false, 'error' => 'ID tidak valid']);
        }
        break;

    case 'update':
        $id = $data['id'];
        $lower = $data['lower_bound'] !== '' ? (int)$data['lower_bound'] : null;
        $upper = $data['upper_bound'] !== '' ? (int)$data['upper_bound'] : null;
        $predikat = trim($data['predikat']);

        $stmt = $conn->prepare("UPDATE grade_ranges SET lower_bound = ?, upper_bound = ?, predikat = ? WHERE id = ?");
        $stmt->bind_param("iisi", $lower, $upper, $predikat, $id);

        $success = $stmt->execute();
        echo json_encode(['success' => $success]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Aksi tidak valid.']);
        break;
}
?>