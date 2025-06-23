let dynamicAssessments = {}; // Stores fetched main and sub-assessments with their IDs

// Utility to create a valid HTML ID
function toId(str) {
    return str.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
}

async function fetchAssessments() {
    try {
        const response = await fetch('php/fetch_assessments.php'); // Mengambil dari file fetch_assessments.php yang baru
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Restrukturisasi data menjadi objek untuk akses yang lebih mudah di renderDynamicForm
        dynamicAssessments = {};
        data.forEach(mainCat => {
            dynamicAssessments[mainCat.id] = { // Gunakan ID main_assessment sebagai kunci
                name: mainCat.name,
                subs: mainCat.subs
            };
        });
        renderDynamicForm();
    } catch (error) {
        console.error("Error fetching assessments:", error);
        alert("Gagal memuat kategori dan sub-penilaian. Silakan coba lagi.");
    }
}

function renderDynamicForm() {
    const container = document.getElementById('dynamicAssessmentsContainer');
    if (!container) return;

    container.innerHTML = '';

    for (const mainId in dynamicAssessments) {
        const mainCategory = dynamicAssessments[mainId];
        const mainName = mainCategory.name;
        const subsArray = mainCategory.subs;

        const section = document.createElement('div');
        section.className = 'form-section';

        // Title + delete main
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'title-wrapper';

        const title = document.createElement('h3');
        title.textContent = mainName;

        const deleteMainBtn = document.createElement('button');
        deleteMainBtn.textContent = '✖';
        deleteMainBtn.title = 'Hapus kategori';
        deleteMainBtn.className = 'delete-btn';
        deleteMainBtn.onclick = () => deleteMainAssessment(mainId, mainName); // Pass mainId directly

        titleWrapper.appendChild(title);
        titleWrapper.appendChild(deleteMainBtn);
        section.appendChild(titleWrapper);

        subsArray.forEach((sub) => {
            const row = document.createElement('div');
            row.className = 'row';

            const label = document.createElement('label');
            label.textContent = sub.name;

            const input = document.createElement('input');
            input.type = 'number';
            input.id = `input_${sub.id}`; // Use sub.id for unique identification
            input.value = 0;
            input.min = 0;

            const deleteSubBtn = document.createElement('button');
            deleteSubBtn.textContent = '🗑️';
            deleteSubBtn.title = 'Hapus sub';
            deleteSubBtn.className = 'delete-btn';
            deleteSubBtn.onclick = () => deleteSubAssessment(sub.id, sub.name, mainName);

            row.appendChild(label);
            row.appendChild(input);
            row.appendChild(deleteSubBtn);
            section.appendChild(row);
        });

        container.appendChild(section);
    }
    updateMainAssessmentSelect();
}

function updateMainAssessmentSelect() {
    const select = document.getElementById('mainAssessmentSelect');
    select.innerHTML = '<option value="">Pilih Kategori</option>';
    // Gunakan data dari dynamicAssessments yang sudah dimuat dengan ID
    for (const mainId in dynamicAssessments) {
        const mainCategory = dynamicAssessments[mainId];
        const option = document.createElement('option');
        option.value = mainId; // Store ID in value
        option.textContent = mainCategory.name;
        select.appendChild(option);
    }
}

async function addMainAssessment() {
    const main = document.getElementById('newMainAssessment').value.trim();
    if (main) {
        try {
            const response = await fetch('php/assessments.php?action=save_main', { // Panggil endpoint baru
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: main })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                document.getElementById('newMainAssessment').value = '';
                fetchAssessments(); // Re-fetch to update the UI
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding main assessment:", error);
            alert("Terjadi kesalahan saat menambahkan kategori.");
        }
    } else {
        alert("Nama kategori tidak boleh kosong.");
    }
}

async function addSubAssessment() {
    const mainId = document.getElementById('mainAssessmentSelect').value;
    const sub = document.getElementById('newSubAssessment').value.trim();
    if (mainId && sub) {
        try {
            const response = await fetch('php/assessments.php?action=save_sub', { // Panggil endpoint baru
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ main_id: mainId, name: sub })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                document.getElementById('newSubAssessment').value = '';
                fetchAssessments(); // Re-fetch to update the UI
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error adding sub assessment:", error);
            alert("Terjadi kesalahan saat menambahkan sub penilaian.");
        }
    } else {
        alert("Pilih kategori dan masukkan nama sub penilaian.");
    }
}

async function deleteMainAssessment(mainId, mainName) {
    if (confirm(`Hapus kategori "${mainName}" dan semua sub-nya?`)) {
        try {
            const response = await fetch('php/assessments.php?action=delete_main', { // Panggil endpoint baru
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: mainId })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                fetchAssessments(); // Re-fetch to update the UI
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting main assessment:", error);
            alert("Terjadi kesalahan saat menghapus kategori.");
        }
    }
}

async function deleteSubAssessment(subId, subName, mainName) {
    if (confirm(`Hapus sub penilaian "${subName}" dari kategori "${mainName}"?`)) {
        try {
            const response = await fetch('php/assessments.php?action=delete_sub', { // Panggil endpoint baru
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: subId })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
                fetchAssessments(); // Re-fetch to update the UI
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Error deleting sub assessment:", error);
            alert("Terjadi kesalahan saat menghapus sub penilaian.");
        }
    }
}

function calculateFinalScore(totalErrors) {
    return 90 - totalErrors;
}

async function submitForm() {
    const projectName = document.getElementById('projectName').value;
    const assessmentsPayload = {};
    let totalErrors = 0;

    // Loop through dynamicAssessments to get all current inputs
    for (const mainId in dynamicAssessments) {
        const mainCategory = dynamicAssessments[mainId];
        assessmentsPayload[mainId] = {}; // Initialize mainId in payload
        mainCategory.subs.forEach(subItem => {
            const inputId = `input_${subItem.id}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) { // Pastikan elemen input ada sebelum mencoba mengambil nilainya
                const val = parseInt(inputElement.value || 0);
                assessmentsPayload[mainId][subItem.id] = val;
                totalErrors += val;
            }
        });
    }

    const finalScore = calculateFinalScore(totalErrors);

    const payload = {
        projectName,
        assessments: assessmentsPayload,
        totalErrors,
        finalScore
    };

    try {
        const response = await fetch('php/save_assessment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const text = await response.text();
        try {
            const data = JSON.parse(text);
            if (data.success) {
                alert("Data berhasil disimpan!");
                document.getElementById('penilaianForm').reset();
                // Optionally reset assessment inputs to 0, but fetching will re-render
                fetchAssessments(); // Reload form with default values
            } else {
                alert("Gagal menyimpan data: " + data.message);
            }
        } catch (e) {
            console.error("Gagal parse JSON:", e, "Response Text:", text);
            alert("Terjadi kesalahan saat memproses response dari server. Lihat konsol untuk detail.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Terjadi kesalahan saat mengirim data.");
    }
}

window.onload = () => {
    fetchAssessments(); // Load assessments from the database on page load
};