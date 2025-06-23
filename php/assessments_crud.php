<?php
require 'db.php';
header('Content-Type: application/json');

$action = $_GET['action'] ?? $_POST['action'] ?? '';
$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case 'save_main':
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Nama kategori tidak boleh kosong.']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id FROM main_assessments WHERE name = ?");
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Kategori penilaian sudah ada.']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO main_assessments (name) VALUES (?)");
        $stmt->bind_param("s", $name);
        $success = $stmt->execute();

        if ($success) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Kategori penilaian berhasil ditambahkan.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menambahkan kategori penilaian: ' . $conn->error]);
        }
        break;

    case 'delete_main':
        $mainAssessmentId = $data['id'] ?? null;
        if (!$mainAssessmentId) {
            echo json_encode(['success' => false, 'message' => 'Main assessment ID tidak valid.']);
            exit;
        }

        $conn->begin_transaction();
        try {
            // Delete associated sub-assessments
            $stmt = $conn->prepare("DELETE FROM sub_assessments WHERE main_assessment_id = ?");
            $stmt->bind_param("i", $mainAssessmentId);
            $stmt->execute();

            // Delete the main assessment
            $stmt = $conn->prepare("DELETE FROM main_assessments WHERE id = ?");
            $stmt->bind_param("i", $mainAssessmentId);
            $stmt->execute();

            $conn->commit();
            echo json_encode(['success' => true, 'message' => 'Kategori penilaian berhasil dihapus.']);
        } catch (Exception $e) {
            $conn->rollback();
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus kategori penilaian: ' . $e->getMessage()]);
        }
        break;

    case 'save_sub':
        $mainId = $data['main_id'] ?? null;
        $name = trim($data['name'] ?? '');

        if (!$mainId || empty($name)) {
            echo json_encode(['success' => false, 'message' => 'Main assessment ID atau nama sub penilaian tidak valid.']);
            exit;
        }

        $stmt = $conn->prepare("SELECT id FROM sub_assessments WHERE main_assessment_id = ? AND name = ?");
        $stmt->bind_param("is", $mainId, $name);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            echo json_encode(['success' => false, 'message' => 'Sub penilaian ini sudah ada dalam kategori yang dipilih.']);
            exit;
        }

        $stmt = $conn->prepare("INSERT INTO sub_assessments (main_assessment_id, name) VALUES (?, ?)");
        $stmt->bind_param("is", $mainId, $name);
        $success = $stmt->execute();

        if ($success) {
            echo json_encode(['success' => true, 'id' => $conn->insert_id, 'message' => 'Sub penilaian berhasil ditambahkan.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menambahkan sub penilaian: ' . $conn->error]);
        }
        break;

    case 'delete_sub':
        $subAssessmentId = $data['id'] ?? null;
        if (!$subAssessmentId) {
            echo json_encode(['success' => false, 'message' => 'Sub assessment ID tidak valid.']);
            exit;
        }

        $stmt = $conn->prepare("DELETE FROM sub_assessments WHERE id = ?");
        $stmt->bind_param("i", $subAssessmentId);
        $success = $stmt->execute();

        if ($success) {
            echo json_encode(['success' => true, 'message' => 'Sub penilaian berhasil dihapus.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Gagal menghapus sub penilaian: ' . $conn->error]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Aksi tidak valid.']);
        break;
}
?>