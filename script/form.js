    let dynamicAssessments = {};

    // Utility
    function toId(str) {
        return str.toLowerCase().replace(/\s+/g, '_');
    }



    function renderDynamicForm() {
        const container = document.getElementById('dynamicAssessmentsContainer');
        if (!container) return;

        container.innerHTML = '';

        for (const [main, subs] of Object.entries(dynamicAssessments)) {
            const section = document.createElement('div');
            section.className = 'form-section';

            // Title + delete main
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'title-wrapper';

            const title = document.createElement('h3');
            title.textContent = main;

            const deleteMainBtn = document.createElement('button');
            deleteMainBtn.textContent = '✖';
            deleteMainBtn.title = 'Hapus kategori';
            deleteMainBtn.className = 'delete-btn';
            deleteMainBtn.onclick = () => deleteMainAssessment(main);

            titleWrapper.appendChild(title);
            titleWrapper.appendChild(deleteMainBtn);
            section.appendChild(titleWrapper);

            subs.forEach((sub, idx) => {
                const row = document.createElement('div');
                row.className = 'row';

                const label = document.createElement('label');
                label.textContent = sub;

                const input = document.createElement('input');
                input.type = 'number';
                input.id = toId(main + '_' + sub);
                input.value = 0;
                input.min = 0;

                const deleteSubBtn = document.createElement('button');
                deleteSubBtn.textContent = '🗑️';
                deleteSubBtn.title = 'Hapus sub';
                deleteSubBtn.className = 'delete-btn';
                deleteSubBtn.onclick = () => deleteSubAssessment(main, idx);

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
        Object.keys(dynamicAssessments).forEach(main => {
            const option = document.createElement('option');
            option.value = main;
            option.textContent = main;
            select.appendChild(option);
        });
    }

    function addMainAssessment() {
        const main = document.getElementById('newMainAssessment').value.trim();
        if (main && !dynamicAssessments[main]) {
            dynamicAssessments[main] = [];
            document.getElementById('newMainAssessment').value = '';
            renderDynamicForm();
        }
    }

    function addSubAssessment() {
        const main = document.getElementById('mainAssessmentSelect').value;
        const sub = document.getElementById('newSubAssessment').value.trim();
        if (main && sub && !dynamicAssessments[main].includes(sub)) {
            dynamicAssessments[main].push(sub);
            document.getElementById('newSubAssessment').value = '';
            renderDynamicForm();
        }
    }

    function deleteMainAssessment(main) {
        if (confirm(`Hapus kategori "${main}" dan semua sub-nya?`)) {
            delete dynamicAssessments[main];
            renderDynamicForm();
        }
    }

    function deleteSubAssessment(main, subIndex) {
        const subName = dynamicAssessments[main][subIndex];
        if (confirm(`Hapus sub penilaian "${subName}" dari kategori "${main}"?`)) {
            dynamicAssessments[main].splice(subIndex, 1);
            renderDynamicForm();
        }
    }

    function calculateFinalScore(totalErrors) {
        return 90 - totalErrors;
    }



    function submitForm() {
        const projectName = document.getElementById('projectName').value;
        const assessments = {};
        let totalErrors = 0;

        for (const [main, subs] of Object.entries(dynamicAssessments)) {
            assessments[main] = {};
            subs.forEach(sub => {
                const inputId = toId(main + '_' + sub);
                const val = parseInt(document.getElementById(inputId).value || 0);
                assessments[main][sub] = val;
                totalErrors += val;
            });
        }

        const finalScore = calculateFinalScore(totalErrors);

        const payload = {
            projectName,
            assessments,
            totalErrors,
            finalScore
        };

        fetch('php/save_assessment.php', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text);
                if (data.success) {
                    alert("Data berhasil disimpan!");
                    document.getElementById('penilaianForm').reset();
                } else {
                    alert("Gagal menyimpan data: " + data.message);
                }
            } catch (e) {
                console.error("Gagal parse JSON:", e);
                alert("Terjadi kesalahan saat memproses response dari server.");
            }
        });
    }

    window.onload = () => {
        dynamicAssessments = {
            "Penguasaan Materi": ["Materi Basis Data", "Materi Struktur", "Materi Matematika", "Materi"],
            "Celah Keamanan": ["Sanitasi", "Authorization"],
            "Fitur Utama": ["Create", "Read", "Update", "Delete"],
            "Fitur Pendukung": ["Responsive", "Load Time"]
        };
        renderDynamicForm();
    };
