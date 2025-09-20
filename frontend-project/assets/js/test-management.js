document.addEventListener('DOMContentLoaded', () => {
      // Set current year in footer
      document.getElementById('year').textContent = new Date().getFullYear();

      // Demo data
      const demoData = {
        users: [
          { name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active' },
          { name: 'Jane Smith', email: 'jane@example.com', role: 'Instructor', status: 'Active' },
          { name: 'Admin User', email: 'admin@example.com', role: 'Admin', status: 'Active' }
        ],
        tests: [
          { title: 'Math Midterm', duration: '60', format: 'MCQ', assigned: 'Group A', action: 'Edit' },
          { title: 'Physics Quiz', duration: '30', format: 'Essay', assigned: 'Group B', action: 'Edit' }
        ],
        schedules: [
          { test: 'Math Midterm', when: '2025-09-15T10:00', audience: 'Group A', reminder: '24h' }
        ],
        questions: [
          { type: 'Multiple-choice', topic: 'Algebra', difficulty: 'Medium', question: 'Solve for x: 2x + 3 = 7' },
          { type: 'Essay', topic: 'Physics', difficulty: 'Hard', question: 'Explain Newton’s laws' }
        ],
        autoGrades: [
          { student: 'John Doe', test: 'Math Midterm', score: '85', status: 'Graded' }
        ],
        manualQueue: [
          { submission: 'Essay #1', learner: 'John Doe', needsReview: 'Yes', action: 'Review' }
        ],
        results: [
          { student: 'John Doe', test: 'Math Midterm', score: '85', feedback: 'Good work!' }
        ],
        notifications: [
          { when: '2025-09-10 13:08', audience: 'All Students', message: 'Test starts at 10:00' }
        ],
        reportPreview: [
          { metric: 'Average Score', value: '82%' },
          { metric: 'Completion Rate', value: '95%' }
        ]
      };

      // Load demo data
      document.getElementById('btnDemoData').addEventListener('click', () => {
        // Populate users table
        const usersTable = document.querySelector('#tblUsers tbody');
        usersTable.innerHTML = demoData.users.map(user => `
          <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>${user.status}</td>
          </tr>
        `).join('');

        // Populate tests table
        const testsTable = document.querySelector('#tblTests tbody');
        testsTable.innerHTML = demoData.tests.map(test => `
          <tr>
            <td>${test.title}</td>
            <td>${test.duration} min</td>
            <td>${test.format}</td>
            <td>${test.assigned}</td>
            <td><button class="btn">${test.action}</button></td>
          </tr>
        `).join('');

        // Populate schedules table
        const schedulesTable = document.querySelector('#tblSchedules tbody');
        schedulesTable.innerHTML = demoData.schedules.map(schedule => `
          <tr>
            <td>${schedule.test}</td>
            <td>${schedule.when}</td>
            <td>${schedule.audience}</td>
            <td>${schedule.reminder}</td>
          </tr>
        `).join('');

        // Populate questions table
        const questionsTable = document.querySelector('#tblQuestions tbody');
        questionsTable.innerHTML = demoData.questions.map(q => `
          <tr>
            <td>${q.type}</td>
            <td>${q.topic}</td>
            <td>${q.difficulty}</td>
            <td>${q.question}</td>
          </tr>
        `).join('');

        // Populate auto grades table
        const autoGradesTable = document.querySelector('#tblAutoGrades tbody');
        autoGradesTable.innerHTML = demoData.autoGrades.map(grade => `
          <tr>
            <td>${grade.student}</td>
            <td>${grade.test}</td>
            <td>${grade.score}</td>
            <td>${grade.status}</td>
          </tr>
        `).join('');

        // Populate manual queue table
        const manualQueueTable = document.querySelector('#tblManualQueue tbody');
        manualQueueTable.innerHTML = demoData.manualQueue.map(item => `
          <tr>
            <td>${item.submission}</td>
            <td>${item.learner}</td>
            <td>${item.needsReview}</td>
            <td><button class="btn">${item.action}</button></td>
          </tr>
        `).join('');

        // Populate results table
        const resultsTable = document.querySelector('#tblResults tbody');
        resultsTable.innerHTML = demoData.results.map(result => `
          <tr>
            <td>${result.student}</td>
            <td>${result.test}</td>
            <td>${result.score}</td>
            <td>${result.feedback}</td>
          </tr>
        `).join('');

        // Populate notifications table
        const notificationsTable = document.querySelector('#tblNotifications tbody');
        notificationsTable.innerHTML = demoData.notifications.map(note => `
          <tr>
            <td>${note.when}</td>
            <td>${note.audience}</td>
            <td>${note.message}</td>
          </tr>
        `).join('');

        // Populate report preview table
        const reportPreviewTable = document.querySelector('#tblReportPreview tbody');
        reportPreviewTable.innerHTML = demoData.reportPreview.map(report => `
          <tr>
            <td>${report.metric}</td>
            <td>${report.value}</td>
          </tr>
        `).join('');

        // Update stats
        document.getElementById('totalTests').textContent = demoData.tests.length;
        document.getElementById('studentsAttended').textContent = demoData.results.length;
        document.getElementById('studentsPassed').textContent = demoData.results.filter(r => parseInt(r.score) >= 50).length;

        // Update feature summary
        document.getElementById('featureSummary').textContent = `Active features: ${document.querySelectorAll('.badge.green').length} enabled, 1 pending.`;

        alert('Demo data loaded!');
      });

      // Initialize chart on page load
      const ctx = document.getElementById('performanceChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ["Algebra", "Geometry", "Physics"],
          datasets: [{
            label: "Average Score (%)",
            data: [85, 78, 92],
            backgroundColor: ["#007bff", "#28a745", "#ffc107"],
            borderColor: ["#0056b3", "#218838", "#e0a800"],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: "Score (%)"
              }
            },
            x: {
              title: {
                display: true,
                text: "Topics"
              }
            }
          },
          plugins: {
            legend: {
              position: "top"
            },
            tooltip: {
              enabled: true
            }
          }
        }
      });

      // Tab switching
      document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          document.querySelectorAll('#authPanels [data-panel]').forEach(panel => {
            panel.hidden = panel.dataset.panel !== tab.dataset.tab;
          });
        });
      });

      // Modals
      document.getElementById('btnNewTest').addEventListener('click', () => document.getElementById('modalTest').showModal());
      document.getElementById('btnAddUser').addEventListener('click', () => document.getElementById('modalUser').showModal());
      document.getElementById('btnAddQuestion').addEventListener('click', () => document.getElementById('modalQuestion').showModal());

      // Form submissions
      document.getElementById('formInstitute').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Profile saved!');
      });

      document.getElementById('formAbout').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('About section saved!');
      });

      document.getElementById('formTest').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Test created!');
        document.getElementById('modalTest').close();
      });

      document.getElementById('formUser').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('User added!');
        document.getElementById('modalUser').close();
      });

      document.getElementById('formQuestion').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Question saved!');
        document.getElementById('modalQuestion').close();
      });

      document.getElementById('btnSendFeedback').addEventListener('click', () => {
        const fbStatus = document.getElementById('fbStatus');
        fbStatus.hidden = false;
        setTimeout(() => {
          fbStatus.hidden = true;
        }, 2000);
      });
    });