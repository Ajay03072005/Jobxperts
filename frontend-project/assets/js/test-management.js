 const demo = {
            tests: [
                { id: 1, title: 'Math Midterm' },
                { id: 2, title: 'Physics Quiz' },
                { id: 3, title: 'Chemistry Final' },
                { id: 4, title: 'English Grammar' },
                { id: 5, title: 'Computer Science Lab' },
                { id: 6, title: 'History Term' }
            ],
            students: [
                'John Doe', 'Jane Smith', 'Arjun Patel', 'Fatima Khan', 'Liu Wei', 'Maria Garcia', 'Carlos Ruiz', 'Sara Lee'
            ],
            results: []
        };

        // generate random results
        (function genResults() {
            const now = Date.now();
            for (let i = 0; i < 30; i++) {
                const s = demo.students[Math.floor(Math.random() * demo.students.length)];
                const t = demo.tests[Math.floor(Math.random() * demo.tests.length)];
                const score = Math.floor(40 + Math.random() * 61); // 40-100
                const status = score >= 50 ? 'Pass' : 'Fail';
                const date = new Date(now - Math.floor(Math.random() * 20) * 24 * 3600 * 1000).toISOString().slice(0, 10);
                demo.results.push({ student: s, test: t.title, score, status, date });
            }
        })();

        // --- populate stats ---
        document.getElementById('statTests').textContent = demo.tests.length;
        document.getElementById('statStudents').textContent = demo.students.length;
        document.getElementById('statSubmits').textContent = demo.results.length;
        document.getElementById('statReports').textContent = Math.floor(demo.results.length / 5);

        // --- charts ---
        const trendCtx = document.getElementById('trendChart').getContext('2d');
        const trendLabels = demo.tests.map(t => t.title);
        const trendData = demo.tests.map(() => Math.floor(60 + Math.random() * 30));
        new Chart(trendCtx, {
            type: 'line',
            data: { labels: trendLabels, datasets: [{ label: 'Average Score', data: trendData, fill: true, backgroundColor: 'rgba(37,99,235,0.12)', borderColor: 'rgba(37,99,235,0.9)', tension: 0.35 }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100 } } }
        });

        const pieCtx = document.getElementById('pieChart').getContext('2d');
        const passCount = demo.results.filter(r => r.status === 'Pass').length;
        const failCount = demo.results.length - passCount;
        new Chart(pieCtx, {
            type: 'doughnut',
            data: { labels: ['Pass', 'Fail'], datasets: [{ data: [passCount, failCount], backgroundColor: ['#22c55e', '#ef4444'] }] },
            options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
        const passPct = Math.round((passCount / demo.results.length) * 100);
        document.getElementById('passPct').textContent = passPct + '%';
        document.getElementById('failPct').textContent = (100 - passPct) + '%';

        // --- results table ---
        const tbody = document.querySelector('#resultsTable tbody');
        function renderTable(rows) {
            tbody.innerHTML = rows.map(r => `<tr><td>${r.student}</td><td>${r.test}</td><td>${r.score}</td><td><span class="badge ${r.status === 'Pass' ? 'pass' : 'fail'}">${r.status}</span></td><td>${r.date}</td></tr>`).join('');
        }
        renderTable(demo.results);

        // --- sorting ---
        const getCell = (row, key) => {
            if (key === 'score') return parseInt(row.score);
            if (key === 'date') return row.date;
            return row[key].toLowerCase();
        };
        document.querySelectorAll('#resultsTable thead th').forEach(th => {
            th.addEventListener('click', () => {
                const key = th.dataset.key;
                const asc = th.dataset.asc !== 'true';
                demo.results.sort((a, b) => {
                    const A = getCell(a, key);
                    const B = getCell(b, key);
                    if (A < B) return asc ? -1 : 1;
                    if (A > B) return asc ? 1 : -1;
                    return 0;
                });
                document.querySelectorAll('#resultsTable thead th').forEach(x => x.dataset.asc = '');
                th.dataset.asc = asc;
                renderTable(demo.results);
            });
            th.addEventListener('touchstart', e => {
                e.preventDefault();
                th.click();
            }, { passive: false });
        });

        // --- table search/filter ---
        document.getElementById('tableSearch').addEventListener('input', (e) => {
            const q = e.target.value.trim().toLowerCase();
            const filtered = demo.results.filter(r => [r.student, r.test, r.status, r.date + '', r.score + ''].some(v => String(v).toLowerCase().includes(q)));
            renderTable(filtered);
        });

        // global search navigates to dashboard view and filters table
        document.getElementById('globalSearch').addEventListener('input', (e) => {
            const q = e.target.value.trim();
            if (q.length > 0) { showView('dashboard'); document.getElementById('tableSearch').value = q; document.getElementById('tableSearch').dispatchEvent(new Event('input')); }
            else { document.getElementById('tableSearch').value = ''; renderTable(demo.results); }
        });

        // --- export PDF (jsPDF) ---
        document.getElementById('btnExportPDF').addEventListener('click', async () => {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF({ orientation: 'landscape' });
            doc.setFontSize(14); doc.text('Recent Results', 14, 14);
            const rows = demo.results.map(r => [r.student, r.test, String(r.score), r.status, r.date]);
            doc.autoTable({ head: [['Student', 'Test', 'Score', 'Status', 'Date']], body: rows, startY: 20 });
            doc.save('results.pdf');
        });

        // --- export Excel (SheetJS) ---
        document.getElementById('btnExportXLS').addEventListener('click', () => {
            const ws = XLSX.utils.json_to_sheet(demo.results);
            const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Results');
            XLSX.writeFile(wb, 'results.xlsx');
        });

        // --- print table ---
        document.getElementById('btnPrintTable').addEventListener('click', () => {
            const html = `<html><head><title>Results</title><style>table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:8px;text-align:left}</style></head><body><h3>Recent Results</h3>${document.querySelector('.table-wrap').innerHTML}</body></html>`;
            const w = window.open('', '_blank'); w.document.write(html); w.document.close(); w.focus(); w.print();
        });

        // --- export all ---
        document.getElementById('btnExportAll').addEventListener('click', () => {
            const payload = { tests: demo.tests, students: demo.students, results: demo.results };
            const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'tm-data.json'; a.click(); URL.revokeObjectURL(url);
        });

        // --- view navigation ---
        function showView(v) {
            document.querySelectorAll('main section').forEach(s => s.style.display = s.id === 'view-' + v ? '' : s.id.startsWith('view-') ? 'none' : s.style.display);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // --- create test button (placeholder) ---
        document.getElementById('btnCreate').addEventListener('click', () => { alert('Create Test — open form (placeholder)'); });

        // --- populate year ---
        document.getElementById('year').textContent = new Date().getFullYear();

        // --- touch support ---
        document.querySelectorAll('.btn').forEach(el => {
            el.addEventListener('touchstart', e => {
                e.preventDefault();
                el.click();
            }, { passive: false });
        });

        // --- smooth scrolling ---
        document.body.style.overflowX = 'hidden';
        document.body.style.touchAction = 'pan-y';

        // show dashboard by default
        showView('dashboard');