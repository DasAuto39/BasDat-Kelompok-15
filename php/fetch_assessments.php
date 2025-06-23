<?php
require 'db.php';
header('Content-Type: application/json');

$allAssessments = [];

$mainResult = $conn->query("SELECT id, name FROM main_assessments ORDER BY name ASC");
if ($mainResult) {
    while ($mainRow = $mainResult->fetch_assoc()) {
        $mainId = $mainRow['id'];
        $mainName = $mainRow['name'];

        $currentMain = [
            'id' => $mainId,
            'name' => $mainName,
            'subs' => []
        ];

        $subStmt = $conn->prepare("SELECT id, name FROM sub_assessments WHERE main_assessment_id = ? ORDER BY name ASC");
        $subStmt->bind_param("i", $mainId);
        $subStmt->execute();
        $subResult = $subStmt->get_result();

        while ($subRow = $subResult->fetch_assoc()) {
            $currentMain['subs'][] = [
                'id' => $subRow['id'],
                'name' => $subRow['name']
            ];
        }
        $allAssessments[] = $currentMain;
    }
}

echo json_encode($allAssessments);
?>