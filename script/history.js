let gradeRanges = [];

async function fetchGradeRanges() {
    const res = await fetch("php/fetch_grade_ranges.php");
    gradeRanges = await res.json();
}

function loadPenilaianData() {
    fetch('php/history.php')
        .then(response => response.json())
        .then(data => {
            displayPenilaianData(data);
        })
        .catch(error => {
            console.error("Error fetching data: ", error);
        });
}

function displayPenilaianData(data) {
    const tableBody = document.querySelector('#penilaianTable tbody');
    tableBody.innerHTML = '';

    data.forEach((item) => {
        const row = document.createElement('tr');

        
        row.innerHTML = `
            <td>${item.projectName}</td>
            <td>${item.totalErrors}</td>
            <td>${item.finalScore}</td>
            <td>${item.predikat}</td>
            <td>${item.status}</td>
            <td><button onclick="deleteData(${item.projectId})">Hapus</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteData(projectId) {
    if (!confirm("Yakin ingin menghapus data ini?")) return;

    fetch('php/delete_assessment.php', {
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
            loadPenilaianData(); // Muat ulang data setelah penghapusan
        } else {
            alert("Gagal menghapus data: " + data.message);
        }
    })
    .catch(error => {
        console.error("Error deleting data: ", error);
        alert("Terjadi kesalahan saat menghapus.");
    });
}


window.addEventListener("DOMContentLoaded", async () => {
    await fetchGradeRanges();
    loadPenilaianData();
});