let gradeRanges = []; // Akan digunakan untuk mengisi filter predikat

async function fetchGradeRanges() {
    try {
        const res = await fetch("php/fetch_grade_ranges.php");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        gradeRanges = await res.json();
        populatePredikatFilter(); // Panggil fungsi untuk mengisi filter setelah data tersedia
    } catch (error) {
        console.error("Error fetching grade ranges:", error);
    }
}

function populatePredikatFilter() {
    const select = document.getElementById('filterPredikat');
    gradeRanges.forEach(range => {
        const option = document.createElement('option');
        option.value = range.predikat;
        option.textContent = range.predikat;
        select.appendChild(option);
    });
}

function applyFilters() {
    const projectName = document.getElementById('filterProjectName').value;
    const predikat = document.getElementById('filterPredikat').value;
    const status = document.getElementById('filterStatus').value;
    const minScore = document.getElementById('filterMinScore').value;
    const maxScore = document.getElementById('filterMaxScore').value;

    loadPenilaianData(projectName, predikat, status, minScore, maxScore);
}

function clearFilters() {
    document.getElementById('filterProjectName').value = '';
    document.getElementById('filterPredikat').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterMinScore').value = '';
    document.getElementById('filterMaxScore').value = '';
    loadPenilaianData();
}

function loadPenilaianData(projectName = '', predikat = '', status = '', minScore = '', maxScore = '') {
    const params = new URLSearchParams();
    if (projectName) params.append('projectName', projectName);
    if (predikat) params.append('predikat', predikat);
    if (status) params.append('status', status);
    if (minScore) params.append('minScore', minScore);
    if (maxScore) params.append('maxScore', maxScore);

    const url = `php/history.php?${params.toString()}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            displayPenilaianData(data);
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
            alert("Gagal memuat histori penilaian. Silakan coba lagi.");
        });
}

function displayPenilaianData(data) {
    const tableBody = document.querySelector('#penilaianTable tbody');
    tableBody.innerHTML = '';

    if (data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7">Tidak ada data yang ditemukan.</td></tr>'; // colspan 7 karena ada kolom Detail
        return;
    }

    data.forEach((item) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.projectName}</td>
            <td>${item.totalErrors}</td>
            <td>${item.finalScore}</td>
            <td>${item.predikat}</td>
            <td>${item.status}</td>
            <td>
                <button class="detail-btn" onclick="viewAssessmentDetails(${item.projectId})">Detail</button>
                <button class="delete-btn" onclick="deleteData(${item.projectId})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteData(projectId) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    fetch('php/project_action.php?action=delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Data berhasil dihapus!");
            loadPenilaianData();
        } else {
            alert("Gagal menghapus data: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error deleting data: ", error);
        alert("Terjadi kesalahan saat menghapus.");
    });
}



const detailsModal = document.getElementById('detailsModal');
const closeButton = document.querySelector('.close-button');
const modalDetailsContent = document.getElementById('modalDetailsContent');

closeButton.onclick = function() {
    detailsModal.style.display = 'none';
};

window.onclick = function(event) {
    if (event.target == detailsModal) {
        detailsModal.style.display = 'none';
    }
};

async function viewAssessmentDetails(projectId) {
    try {
        const response = await fetch(`php/fetch_assessment_details.php?projectId=${projectId}`);
        if (!response.ok) {
            // Include response text in error for better debugging
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }
        const data = await response.json();

        if (data.success) {
            let contentHtml = '';
            if (Object.keys(data.details).length === 0) {
                contentHtml = '<p>Tidak ada detail kesalahan yang tercatat untuk proyek ini.</p>';
            } else {
                // *** Start of TABLE GENERATION LOGIC ***
                contentHtml += '<div class="assessment-details-wrapper">';
                for (const mainCategory in data.details) {
                    contentHtml += `<div class="main-category-block">`;
                    contentHtml += `<h4>${mainCategory}</h4>`;
                    contentHtml += `<table class="sub-assessment-table">`;
                    contentHtml += `<thead><tr><th>Sub Penilaian</th><th>Poin Kesalahan</th></tr></thead>`;
                    contentHtml += `<tbody>`;
                    for (const subCategory in data.details[mainCategory]) {
                        contentHtml += `<tr><td>${subCategory}</td><td><strong>${data.details[mainCategory][subCategory]}</strong></td></tr>`;
                    }
                    contentHtml += `</tbody></table>`;
                    contentHtml += `</div>`; // Close main-category-block
                }
                contentHtml += '</div>'; // Close assessment-details-wrapper
                // *** End of TABLE GENERATION LOGIC ***
            }
            modalDetailsContent.innerHTML = contentHtml;
            // Use 'flex' for display property to allow centering with align-items/justify-content in CSS
            detailsModal.style.display = 'flex';
        } else {
            alert("Gagal memuat detail penilaian: " + data.message);
        }

    } catch (error) {
        console.error("Error fetching assessment details:", error);
        alert("Terjadi kesalahan saat memuat detail penilaian.");
    }
}

// --- End New functions for Detail Modal ---


window.addEventListener("DOMContentLoaded", async () => {
    await fetchGradeRanges();
    loadPenilaianData();
});