    <?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);
require 'db.php';

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);
$projectId = $data['projectId'] ?? null;

switch ($action) {
    case 'save':
        $projectName = $data['projectName'];
        $assessments = $data['assessments']; 
        $totalErrors = (int)$data['totalErrors'];
        $finalScore = (int)$data['finalScore'];

        // 1. Simpan project
        $stmt = $conn->prepare("INSERT INTO projects (name) VALUES (?)");
        $stmt->bind_param("s", $projectName);
        $stmt->execute();
        $projectId = $stmt->insert_id;

        // 2. Cari predikat dari grade_ranges
        $stmtGrade = $conn->prepare("
            SELECT predikat
            FROM grade_ranges
            WHERE
                (lower_bound IS NULL OR ? >= lower_bound) AND
                (upper_bound IS NULL OR ? <= upper_bound)
            LIMIT 1
        ");
        $stmtGrade->bind_param("ii", $finalScore, $finalScore);
        $stmtGrade->execute();
        $result = $stmtGrade->get_result();

        $grade = "Tidak Diketahui";
        if ($row = $result->fetch_assoc()) {
            $grade = $row['predikat'];
        }

        // 3. Tentukan status (misal >= 51: Lulus)
        $status = $finalScore >= 51 ? "Lulus" : "Mengulang";

        // 4. Simpan hasil ke project_results
        $stmt = $conn->prepare("INSERT INTO project_results (project_id, total_errors, final_score, predikat, status) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("iiiss", $projectId, $totalErrors, $finalScore, $grade, $status);
        $stmt->execute();
        $projectResultId = $stmt->insert_id;

        // 5. Simpan assessment scores
        foreach ($assessments as $mainId => $subs) {
            foreach ($subs as $subId => $error) {
                $stmt = $conn->prepare("INSERT INTO assessment_scores (project_id, sub_assessment_id, error_count) VALUES (?, ?, ?)");
                $stmt->bind_param("iii", $projectId, $subId, $error);
                $stmt->execute();
            }
        }

        echo json_encode([
            "success" => true,
            "id" => $projectResultId,
            "message" => "Data berhasil disimpan!"
        ]);
        break;

    case 'delete': 
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


}

$conn->close();
?>