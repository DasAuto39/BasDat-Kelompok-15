<?php
include 'db.php';
header('Content-Type: application/json');

$filterProjectName = $_GET['projectName'] ?? '';
$filterPredikat = $_GET['predikat'] ?? '';
$filterStatus = $_GET['status'] ?? '';
$filterMinScore = $_GET['minScore'] ?? ''; 
$filterMaxScore = $_GET['maxScore'] ?? ''; 

$query = "SELECT p.id as project_id, p.name as project_name, r.total_errors, r.final_score, r.predikat, r.status
            FROM projects p
            JOIN project_results r ON p.id = r.project_id";

$whereClauses = [];
$params = []; 
$types = '';

if (!empty($filterProjectName)) {
    $whereClauses[] = "p.name LIKE ?";
    $params[] = "%" . $filterProjectName . "%";
    $types .= 's';
}

if (!empty($filterPredikat)) {
    $whereClauses[] = "r.predikat = ?";
    $params[] = $filterPredikat;
    $types .= 's';
}

if (!empty($filterStatus)) {
    $whereClauses[] = "r.status = ?";
    $params[] = $filterStatus;
    $types .= 's';
}

// Tambahan filter skor
if (!empty($filterMinScore) && is_numeric($filterMinScore)) {
    $whereClauses[] = "r.final_score >= ?";
    $params[] = (int)$filterMinScore;
    $types .= 'i'; 
}

if (!empty($filterMaxScore) && is_numeric($filterMaxScore)) {
    $whereClauses[] = "r.final_score <= ?";
    $params[] = (int)$filterMaxScore;
    $types .= 'i'; 
}


if (!empty($whereClauses)) {
    $query .= " WHERE " . implode(" AND ", $whereClauses);
}

$query .= " ORDER BY p.id DESC"; 

$stmt = $conn->prepare($query);

if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Gagal menyiapkan statement: " . $conn->error]);
    exit;
}

if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}

$stmt->execute();
$result = $stmt->get_result();

$penilaianData = [];
while ($row = $result->fetch_assoc()) {
    $penilaianData[] = [
        'projectId' => $row['project_id'],
        'projectName' => $row['project_name'],
        'totalErrors' => $row['total_errors'],
        'finalScore' => $row['final_score'],
        'predikat' => $row['predikat'],
        'status' => $row['status']
    ];
}

echo json_encode($penilaianData);
$stmt->close();
$conn->close();
?>