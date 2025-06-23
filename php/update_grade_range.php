<?php
require 'db.php';
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'];
$lower = $data['lower_bound'] !== '' ? (int)$data['lower_bound'] : null;
$upper = $data['upper_bound'] !== '' ? (int)$data['upper_bound'] : null;
$predikat = trim($data['predikat']);

$stmt = $conn->prepare("UPDATE grade_ranges SET lower_bound = ?, upper_bound = ?, predikat = ? WHERE id = ?");
$stmt->bind_param("iisi", $lower, $upper, $predikat, $id);

$success = $stmt->execute();
echo json_encode(['success' => $success]);
?>
