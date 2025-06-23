document.addEventListener("DOMContentLoaded", () => {
    loadRanges();

    const form = document.getElementById("gradeRangeForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const data = {
            lower_bound: formData.get("lower_bound"),
            upper_bound: formData.get("upper_bound"),
            predikat: formData.get("predikat")
        };

        fetch('php/save_grade_range.php', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if (res.success) {
                form.reset();
                loadRanges();
            } else {
                alert(res.message || "Gagal menambahkan data.");
            }
        });
    });
});

function loadRanges() {
    fetch("php/fetch_grade_ranges.php")
        .then(res => res.json())
        .then(data => {
            const table = document.getElementById("rangeTable").querySelector("tbody");
            table.innerHTML = '';

            data.forEach(item => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${item.lower_bound !== null ? item.lower_bound : "-"}</td>
                    <td>${item.upper_bound !== null ? item.upper_bound : "-"}</td>
                    <td>${item.predikat}</td>
                    <td>
                        <button onclick="editRange(${item.id}, ${item.lower_bound}, ${item.upper_bound}, '${item.predikat}')">✏️</button>
                        <button onclick="deleteRange(${item.id})">🗑️</button>
                    </td>
                `;
                table.appendChild(tr);
            });
        });
}



function deleteRange(id) {
    if (!confirm("Yakin ingin menghapus rentang ini?")) return;

    fetch("php/delete_grade_range.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    })
    .then(res => res.json())
    .then(() => loadRanges());
}

function editRange(id, lower, upper, predikat) {
    const newLower = prompt("Nilai Minimum:", lower !== null ? lower : '');
    const newUpper = prompt("Nilai Maksimum:", upper !== null ? upper : '');
    const newPredikat = prompt("Predikat:", predikat);

    fetch("php/update_grade_range.php", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            lower_bound: newLower,
            upper_bound: newUpper,
            predikat: newPredikat
        })
    })
    .then(res => res.json())
    .then(() => loadRanges());
}
