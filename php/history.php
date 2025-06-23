    <?php
    include 'db.php';

    $query = "SELECT p.id as project_id, p.name as project_name, r.total_errors, r.final_score, r.predikat,  r.status 
            FROM projects p
            JOIN project_results r ON p.id = r.project_id";


    $result = $conn->query($query);

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
    ?>
