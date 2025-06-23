<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$projectId = $data['projectId'] ?? null;

if (!$projectId) {
    echo json_encode(["success" => false, "message" => "Project ID tidak valid."]);
    exit;
}

// Hapus dari assessment_scores
$stmt = $conn->prepare("DELETE FROM assessment_scores WHERE project_id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Gagal menyiapkan statement (scores): " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $projectId);
$stmt->execute();

// Hapus dari project_results
$stmt = $conn->prepare("DELETE FROM project_results WHERE project_id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Gagal menyiapkan statement (results): " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $projectId);
$stmt->execute();

// Hapus dari projects
$stmt = $conn->prepare("DELETE FROM projects WHERE id = ?");
if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Gagal menyiapkan statement (projects): " . $conn->error]);
    exit;
}
$stmt->bind_param("i", $projectId);
$stmt->execute();

echo json_encode(["success" => true, "message" => "Data berhasil dihapus."]);
