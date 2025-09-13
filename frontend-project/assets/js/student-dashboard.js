

function loadNavbar() {
    fetch('../components/navbar.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('navbar-container').innerHTML = html;
        });
}

window.addEventListener("DOMContentLoaded", () => {
    loadNavbar();
    // ...existing code...
});

async function fetchNotifications() {
    const container = document.getElementById("notificationsList");
    container.innerHTML = "<div>Loading notifications...</div>";
    try {
        const res = await fetch("/api/notifications");
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const notifications = await res.json();
        container.innerHTML = "";
        notifications.forEach(item => {
            const card = document.createElement("div");
            card.className = `notification-card ${item.type || ''}`;
            card.innerHTML = `
                <div class="notification-title">${item.title}</div>
                <div class="notification-desc">${item.desc}</div>
                <div class="notification-meta">${item.time}
                    <span class="notification-tag">${item.tag}</span>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        container.innerHTML = `<div style='color:red;'>Error loading notifications</div>`;
    }
}

// Fetch and render course card from backend
async function fetchCourses() {
    const courseCard = document.querySelector(".course-card");
    if (!courseCard) return;
    courseCard.innerHTML = "<div>Loading course...</div>";
    try {
        const res = await fetch("/api/courses");
        if (!res.ok) throw new Error("Failed to fetch courses");
        const courses = await res.json();
        // For demo, show first course
        const course = courses[0];
        courseCard.innerHTML = `
            <div class="course-title">${course.title}</div>
            <div class="course-meta">by ${course.instructor} &bull; ${course.duration} &bull; ${course.nextSession}</div>
            <div class="course-progress">
                <div class="progress-bar"><div class="progress-fill" style="width:${course.progress}%"></div></div>
                <span>${course.progress}%</span>
                <span class="course-status active">${course.status}</span>
            </div>
            <div class="course-actions">
                <button class="continue-btn">Continue Learning</button>
                <button class="details-btn">View Details</button>
            </div>
        `;
    } catch (err) {
        courseCard.innerHTML = `<div style='color:red;'>Error loading course</div>`;
    }
}

// Fetch and render summary cards from backend
async function fetchSummary() {
    const summaryCards = document.querySelectorAll(".summary-card");
    try {
        const res = await fetch("/api/summary");
        if (!res.ok) throw new Error("Failed to fetch summary");
        const summary = await res.json();
        // Order: active courses, gpa, credits, applications
        if (summaryCards.length >= 4) {
            summaryCards[0].querySelector(".summary-value").textContent = summary.activeCourses;
            summaryCards[0].querySelector(".summary-desc").textContent = `of ${summary.totalCourses} enrolled`;
            summaryCards[1].querySelector(".summary-value").textContent = summary.gpa;
            summaryCards[1].querySelector(".summary-desc").textContent = summary.gpaChange;
            summaryCards[2].querySelector(".summary-value").textContent = summary.creditsEarned;
            summaryCards[2].querySelector(".summary-desc").textContent = `${summary.creditsRequired} required for graduation`;
            summaryCards[3].querySelector(".summary-value").textContent = summary.applications;
            summaryCards[3].querySelector(".summary-desc").textContent = `placement applications`;
        }
    } catch (err) {
        summaryCards.forEach(card => {
            card.querySelector(".summary-value").textContent = "-";
            card.querySelector(".summary-desc").textContent = "Error";
        });
    }
}
window.addEventListener("DOMContentLoaded", () => {
    fetchNotifications();
    fetchCourses();
    fetchSummary();
});
