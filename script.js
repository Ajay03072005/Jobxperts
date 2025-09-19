// ---------- Simple SPA Helpers ----------
    const $ = (sel, root = document) => root.querySelector(sel);
    const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
    const state = {
      users: [],
      tests: [],
      schedules: [],
      questions: [],
      autoGrades: [],
      manualQueue: [],
      results: [],
      notifications: [],
      defaults: { duration: 60, format: 'Mixed', shuffle: true },
      institute: { name: '', location: '', contact: '' },
      about: { mission: '', vision: '', values: '' }
    };

    const LS_KEY = 'tmi-demo-v1';
    function save() { localStorage.setItem(LS_KEY, JSON.stringify(state)); syncStorageBadge(); }
    function load() { const s = localStorage.getItem(LS_KEY); if (s) { Object.assign(state, JSON.parse(s)); } }
    function syncStorageBadge() {
      const total = state.users.length + state.tests.length + state.schedules.length + state.questions.length + state.results.length + state.notifications.length;
      $('#storageCount').textContent = total;
    }

    // ---------- Sidebar Toggle ----------
    const sidebar = $('.sidebar');
    const toggleBtn = $('.sidebar-toggle');
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      toggleBtn.classList.toggle('open');
    });
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 780 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
        toggleBtn.classList.remove('open');
      }
    });

    // ---------- Rendering ----------
    function renderUsers() {
      const tbody = $('#tblUsers tbody');
      tbody.innerHTML = state.users.map(u => `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td><span class="badge ${u.role === 'Admin' ? 'green' : ''}">${u.active ? 'Active' : 'Invited'}</span></td></tr>`).join('');
    }
    function renderTests() {
      const tbody = $('#tblTests tbody');
      tbody.innerHTML = state.tests.map((t, i) => `<tr><td>${t.title}</td><td>${t.duration}m</td><td>${t.format}</td><td>${t.assigned || '-'}</td><td><button class="btn" data-edit-test="${i}">Edit</button></td></tr>`).join('');
      const sel = $('#schedTest');
      sel.innerHTML = state.tests.map((t, i) => `<option value="${i}">${t.title}</option>`).join('');
    }
    function renderSchedules() {
      const tbody = $('#tblSchedules tbody');
      tbody.innerHTML = state.schedules.map(s => `<tr><td>${s.test}</td><td>${new Date(s.when).toLocaleString()}</td><td>${s.audience}</td><td>${s.rem}</td></tr>`).join('');
    }
    function renderQuestions() {
      const tbody = $('#tblQuestions tbody');
      tbody.innerHTML = state.questions.map(q => `<tr><td>${q.type}</td><td>${q.topic}</td><td>${q.diff}</td><td>${q.text}</td></tr>`).join('');
    }
    function renderGrades() {
      $('#tblAutoGrades tbody').innerHTML = state.autoGrades.map(g => `<tr><td>${g.student}</td><td>${g.test}</td><td>${g.score}%</td><td>${g.status}</td></tr>`).join('');
      $('#tblManualQueue tbody').innerHTML = state.manualQueue.map(m => `<tr><td>${m.item}</td><td>${m.student}</td><td>${m.reason}</td><td><button class="btn" data-review="${m.item}">Review</button></td></tr>`).join('');
    }
    function renderResults() {
      $('#tblResults tbody').innerHTML = state.results.map(r => `<tr><td>${r.student}</td><td>${r.test}</td><td>${r.score}%</td><td>${r.feedback || ''}</td></tr>`).join('');
    }
    function renderNotifications() {
      $('#tblNotifications tbody').innerHTML = state.notifications.map(n => `<tr><td>${new Date(n.when).toLocaleString()}</td><td>${n.to}</td><td>${n.msg}</td></tr>`).join('');
    }
    function renderInsights() {
      const el = $('#insights');
      const aggregates = {};
      state.results.forEach(r => { aggregates[r.student] = (aggregates[r.student] || []); aggregates[r.student].push(r.score); });
      const items = Object.entries(aggregates).map(([name, arr]) => ({ name, avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) }));
      el.innerHTML = items.map(i => `<div class="card stat"><div>${i.name}</div><div class="badge ${i.avg >= 75 ? 'green' : i.avg >= 50 ? 'amber' : 'red'}">Avg ${i.avg}%</div></div>`).join('') || '<p class="muted">No data yet.</p>';
    }

    // Simple bar chart with inline SVG
    function renderChart() {
      const svg = $('#chart');
      const data = [
        { topic: 'Math', avg: 72 },
        { topic: 'Science', avg: 81 },
        { topic: 'English', avg: 65 },
        { topic: 'History', avg: 58 },
        { topic: 'CS', avg: 88 }
      ];
      const width = 600, height = 260, pad = 32;
      const bw = (width - pad * 2) / data.length;
      const bars = data.map((d, i) => {
        const h = (height - pad * 2) * (d.avg / 100);
        const x = pad + i * bw + 8;
        const y = height - pad - h;
        return `<rect x="${x}" y="${y}" width="${bw - 16}" height="${h}" rx="8"></rect>
                <text x="${x + (bw - 16) / 2}" y="${height - pad + 16}" text-anchor="middle" font-size="12" fill="#94a3b8">${d.topic}</text>
                <text x="${x + (bw - 16) / 2}" y="${y - 6}" text-anchor="middle" font-size="12" fill="#94a3b8">${d.avg}%</text>`;
      }).join('');
      svg.innerHTML = `
        <defs>
          <linearGradient id="g" x1="0" x2="1"><stop offset="0%" stop-color="${getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()}"/><stop offset="100%" stop-color="#16a34a"/></linearGradient>
        </defs>
        <rect x="${pad}" y="${pad}" width="${width - pad * 2}" height="${height - pad * 2}" fill="none" stroke="#1f2937" rx="12"/>
        ${bars.replaceAll('<rect', '<rect fill="url(#g)"')}
      `;
    }

    // ---------- Events & Actions ----------
    const modalTest = $('#modalTest');
    const modalUser = $('#modalUser');
    const modalQuestion = $('#modalQuestion');

    $('#btnNewTest').addEventListener('click', () => { modalTest.showModal(); sidebar.classList.remove('open'); toggleBtn.classList.remove('open'); });
    $('#btnCreateTest').addEventListener('click', () => { modalTest.showModal(); sidebar.classList.remove('open'); toggleBtn.classList.remove('open'); });
    $('#formTest').addEventListener('submit', e => {
      e.preventDefault();
      const t = {
        title: $('#testTitle').value.trim(),
        duration: parseInt($('#testDuration').value, 10) || state.defaults.duration,
        format: $('#testFormat').value,
        instructions: $('#testInstructions').value.trim()
      };
      if (!t.title) return;
      state.tests.push(t); save(); renderTests(); modalTest.close();
    });

    $('#btnAddUser').addEventListener('click', () => { modalUser.showModal(); sidebar.classList.remove('open'); toggleBtn.classList.remove('open'); });
    $('#formUser').addEventListener('submit', e => {
      e.preventDefault();
      const u = { name: $('#userName').value.trim(), email: $('#userEmail').value.trim(), role: $('#userRole').value, active: true };
      if (!u.name || !u.email) return;
      state.users.push(u); save(); renderUsers(); modalUser.close();
    });

    $('#btnAddQuestion').addEventListener('click', () => { modalQuestion.showModal(); sidebar.classList.remove('open'); toggleBtn.classList.remove('open'); });
    $('#formQuestion').addEventListener('submit', e => {
      e.preventDefault();
      const q = { type: $('#qType').value, topic: $('#qTopic').value || '-', diff: $('#qDiff').value, text: $('#qText').value.trim() };
      if (!q.text) return;
      state.questions.push(q); save(); renderQuestions(); modalQuestion.close();
    });

    $('#btnImportQuestions').addEventListener('click', () => $('#fileImport').click());
    $('#fileImport').addEventListener('change', async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const text = await file.text();
      try { const arr = JSON.parse(text); if (Array.isArray(arr)) { state.questions.push(...arr); save(); renderQuestions(); } } catch (err) { alert('Invalid JSON'); }
      e.target.value = '';
    });

    $('#btnSchedule').addEventListener('click', () => {
      const idx = parseInt($('#schedTest').value, 10);
      const when = $('#schedDT').value; const audience = $('#schedAudience').value.trim(); const rem = $('#schedReminders').value;
      if (Number.isNaN(idx) || !when) return alert('Pick a test and date');
      state.schedules.push({ test: state.tests[idx]?.title || 'Test', when, audience, rem }); save(); renderSchedules();
    });

    $('#btnSendFeedback').addEventListener('click', () => {
      const s = $('#fbStudent').value.trim(); const t = $('#fbTest').value.trim(); const f = $('#fbText').value.trim();
      if (!s || !t || !f) return; const r = state.results.find(r => r.student === s && r.test === t);
      if (r) { r.feedback = f; } else { state.results.push({ student: s, test: t, score: 0, feedback: f }); }
      save(); renderResults(); const tag = $('#fbStatus'); tag.hidden = false; setTimeout(() => tag.hidden = true, 1500);
    });

    $('#btnNotify').addEventListener('click', () => {
      const to = $('#notifyTo').value.trim(); const msg = $('#notifyMsg').value.trim();
      if (!to || !msg) return;
      state.notifications.push({ when: Date.now(), to, msg }); save(); renderNotifications(); $('#notifyMsg').value = '';
    });

    $('#btnExport').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a');
      a.href = url; a.download = 'tmi-data.json'; a.click(); URL.revokeObjectURL(url);
    });

    $('#btnExportAudit').addEventListener('click', () => {
      const logs = state.notifications.map(n => ({ type: 'notification', ...n }))
        .concat(state.schedules.map(s => ({ type: 'schedule', ...s })));
      const blob = new Blob([JSON.stringify({ generated: new Date().toISOString(), logs }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'audit-logs.json'; a.click(); URL.revokeObjectURL(url);
    });

    $('#btnGenReport').addEventListener('click', () => {
      const metrics = {
        totalUsers: state.users.length,
        totalTests: state.tests.length,
        scheduled: state.schedules.length,
        questions: state.questions.length,
        avgScore: state.results.length ? Math.round(state.results.reduce((a, b) => a + b.score, 0) / state.results.length) : 0
      };
      const tbody = $('#tblReportPreview tbody');
      tbody.innerHTML = Object.entries(metrics).map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');

      const blob = new Blob([JSON.stringify({ generated: new Date().toISOString(), metrics }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'tmi-report.json'; a.click(); URL.revokeObjectURL(url);
    });

    $('#btnSaveDefaults').addEventListener('click', () => {
      state.defaults.duration = parseInt($('#defDuration').value, 10) || 60;
      state.defaults.format = $('#defFormat').value; state.defaults.shuffle = $('#shuffleQuestions').checked; save();
      alert('Defaults saved');
    });

    $('#btnSaveInstituteSettings').addEventListener('click', () => alert('Settings saved'));

    $('#formInstitute').addEventListener('submit', e => {
      e.preventDefault();
      state.institute.name = $('#instName').value; state.institute.location = $('#instLocation').value; state.institute.contact = $('#instContact').value; save();
      updateBreadcrumb('Dashboard ▸ ' + (state.institute.name || 'Overview'));
    });
    $('#formAbout').addEventListener('submit', e => {
      e.preventDefault();
      state.about.mission = $('#instMission').value; state.about.vision = $('#instVision').value; state.about.values = $('#instValues').value; save();
      alert('About saved');
    });

    // Demo data
    $('#btnDemoData').addEventListener('click', () => {
      Object.assign(state, state, {
        users: [
          { name: 'Asha Verma', email: 'asha@inst.edu', role: 'Admin', active: true },
          { name: 'Rahul Kumar', email: 'rahul@inst.edu', role: 'Instructor', active: true },
          { name: 'Priya Singh', email: 'priya@inst.edu', role: 'Student', active: true },
          { name: 'Hemant Yadav', email: 'hemant@inst.edu', role: 'Student', active: true }
        ],
        tests: [
          { title: 'Math Midterm', duration: 60, format: 'Mixed', instructions: 'Answer all questions.' },
          { title: 'Physics Quiz 1', duration: 30, format: 'MCQ', instructions: 'No calculators allowed.' }
        ],
        schedules: [
          { test: 'Math Midterm', when: new Date(Date.now() + 86400000).toISOString(), audience: 'Group A', rem: '24h' }
        ],
        questions: [
          { type: 'Multiple-choice', topic: 'Algebra', diff: 'Medium', text: 'Solve for x: 2x + 5 = 15' },
          { type: 'Essay', topic: 'Optics', diff: 'Hard', text: 'Explain the principle of interference.' }
        ],
        autoGrades: [
          { student: 'Priya Singh', test: 'Physics Quiz 1', score: 86, status: 'Graded' }
        ],
        manualQueue: [
          { item: '#E-2041', student: 'Hemant Yadav', reason: 'Essay pending review' }
        ],
        results: [
          { student: 'Priya Singh', test: 'Physics Quiz 1', score: 86, feedback: 'Great work on MCQs!' },
          { student: 'Hemant Yadav', test: 'Math Midterm', score: 72, feedback: '' }
        ],
        notifications: [
          { when: Date.now() - 3600000, to: 'Students', msg: 'Remember to revise Algebra.' }
        ]
      });
      save();
      renderAll();
    });

    // Tabs (Auth)
    $$('.tab').forEach(tab => tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.toggle('active', t === tab));
      const name = tab.dataset.tab; $$('#authPanels [data-panel]').forEach(p => p.hidden = p.dataset.panel !== name);
    }));

    // Sidebar navigation activation and filtering
    $('#sidebarSearch').addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      $$('#sidebarNav a').forEach(a => { a.hidden = !a.textContent.toLowerCase().includes(q); });
    });

    $$('#sidebarNav a').forEach(a => a.addEventListener('click', (ev) => {
      $$('#sidebarNav a').forEach(x => x.classList.remove('active'));
      ev.currentTarget.classList.add('active');
      updateBreadcrumb('Dashboard ▸ ' + ev.currentTarget.textContent);
      if (window.innerWidth <= 780) {
        sidebar.classList.remove('open');
        toggleBtn.classList.remove('open');
      }
    }));

    function updateBreadcrumb(text) { $('#breadcrumbs').textContent = text; }

    function renderAll() {
      renderUsers(); renderTests(); renderSchedules(); renderQuestions(); renderGrades(); renderResults(); renderNotifications(); renderInsights(); renderChart(); featureSummary(); syncStorageBadge();
      $('#instName').value = state.institute.name || ''; $('#instLocation').value = state.institute.location || ''; $('#instContact').value = state.institute.contact || '';
      $('#instMission').value = state.about.mission || ''; $('#instVision').value = state.about.vision || ''; $('#instValues').value = state.about.values || '';
      $('#defDuration').value = state.defaults.duration; $('#defFormat').value = state.defaults.format; $('#shuffleQuestions').checked = !!state.defaults.shuffle;
    }

    function featureSummary() {
      const features = [
        { name: 'Automated Grading', on: true },
        { name: 'Manual Review', on: true },
        { name: 'Scheduling', on: true },
        { name: 'Proctoring', on: $('#optProctor').checked },
        { name: 'Lockdown', on: $('#optLockdown').checked },
        { name: '2FA', on: $('#opt2FA').checked },
      ];
      $('#featureSummary').innerHTML = features.map(f => `<span class="badge ${f.on ? 'green' : 'red'}">${f.name} ${f.on ? 'ON' : 'OFF'}</span>`).join(' ');
    }

    // Security toggles
    ['optProctor', 'optLockdown', 'opt2FA', 'optPlagiarism', 'optSuspect', 'optIPLimit'].forEach(id => {
      $('#' + id).addEventListener('change', () => { featureSummary(); const strong = $('#optProctor').checked && $('#opt2FA').checked; $('#securityStatus').textContent = strong ? 'Hardened' : 'Baseline secure'; });
    });

    // Footer year
    $('#year').textContent = new Date().getFullYear();

    // Load state & initial render
    load(); renderAll();

    // Keyboard shortcut: focus search
    window.addEventListener('keydown', (e) => { if ((e.ctrlKey || e.metaKey) && e.key === '/') { e.preventDefault(); $('#sidebarSearch').focus(); } });

    // Click action delegates
    $('#tblTests').addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-edit-test]');
      if (!btn) return; const idx = parseInt(btn.dataset.editTest, 10);
      const t = state.tests[idx]; if (!t) return;
      $('#testTitle').value = t.title; $('#testDuration').value = t.duration; $('#testFormat').value = t.format; $('#testInstructions').value = t.instructions || '';
      modalTest.showModal();
      const handler = (ev) => { ev.preventDefault(); t.title = $('#testTitle').value; t.duration = parseInt($('#testDuration').value, 10) || t.duration; t.format = $('#testFormat').value; t.instructions = $('#testInstructions').value; save(); renderTests(); modalTest.close(); $('#formTest').removeEventListener('submit', handler); $('#formTest').addEventListener('submit', defaultCreateHandler, { once: true }); };
      const defaultCreateHandler = (ev) => { };
      $('#formTest').addEventListener('submit', handler, { once: true });
    });