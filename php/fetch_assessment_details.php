<?php
require 'db.php';
header('Content-Type: application/json');

$projectId = $_GET['projectId'] ?? null;

if (!$projectId) {
    echo json_encode(["success" => false, "message" => "Project ID tidak valid."]);
    exit;
}

$query = "SELECT
            ma.name AS main_assessment_name,
            sa.name AS sub_assessment_name,
            ass_score.error_count -- Alias diubah dari 'asc' menjadi 'ass_score'
          FROM
            assessment_scores ass_score -- Alias diubah dari 'asc' menjadi 'ass_score'
          JOIN
            sub_assessments sa ON ass_score.sub_assessment_id = sa.id
          JOIN
            main_assessments ma ON sa.main_assessment_id = ma.id
          WHERE
            ass_score.project_id = ?
          ORDER BY
            ma.name, sa.name";

$stmt = $conn->prepare($query);
if ($stmt === false) {
    echo json_encode(["success" => false, "message" => "Gagal menyiapkan statement: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $projectId);
$stmt->execute();
$result = $stmt->get_result();

$details = [];
while ($row = $result->fetch_assoc()) {
    $mainName = $row['main_assessment_name'];
    $subName = $row['sub_assessment_name'];
    $errorCount = $row['error_count'];

    if (!isset($details[$mainName])) {
        $details[$mainName] = [];
    }
    $details[$mainName][$subName] = $errorCount;
}

echo json_encode(["success" => true, "details" => $details]);
$stmt->close();
$conn->close();
?>