<?php
require 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

$lower = $data['lower_bound'] !== '' ? $data['lower_bound'] : null;
$upper = $data['upper_bound'] !== '' ? $data['upper_bound'] : null;
$predikat = $data['predikat'] ?? '';

$stmt = $conn->prepare("INSERT INTO grade_ranges (lower_bound, upper_bound, predikat) VALUES (?, ?, ?)");
$stmt->bind_param("dds", $lower, $upper, $predikat); 
// "d" = double (number), "s" = string
$stmt->execute();

echo json_encode(['success' => true]);
?>
