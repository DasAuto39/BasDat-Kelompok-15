<?php
require 'db.php';
header('Content-Type: application/json');

$result = $conn->query("SELECT * FROM grade_ranges ORDER BY lower_bound ASC");

$rows = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
}
echo json_encode($rows);
?>