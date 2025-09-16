const STORAGE_KEY = "applications-data-v1";

const defaultApplications = [
  { id: 1, name: "Alice Johnson", program: "Computer Science", submittedOn: "2025-08-14", status: "pending" },
  { id: 2, name: "Brian Lee", program: "Mechanical Engineering", submittedOn: "2025-08-16", status: "pending" },
  { id: 3, name: "Chitra Patel", program: "Mathematics", submittedOn: "2025-08-12", status: "approved" },
  { id: 4, name: "Diego Fernandez", program: "Business Administration", submittedOn: "2025-08-10", status: "rejected" },
  { id: 5, name: "Emily Chen", program: "Biology", submittedOn: "2025-08-18", status: "pending" },
];

function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultApplications;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultApplications;
  } catch (e) {
    return defaultApplications;
  }
}

function saveApplications(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (_) {}
}

let applications = loadApplications();

const tbody = document.getElementById("applicationsTbody");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

function getStatusBadgeClass(status) {
  if (status === "approved") return "badge status-approved";
  if (status === "rejected") return "badge status-rejected";
  return "badge status-pending";
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

function renderRows(list) {
  tbody.innerHTML = "";
  for (const app of list) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-id", String(app.id));

    const tdName = document.createElement("td");
    tdName.textContent = app.name;
    tdName.setAttribute("data-label", "Student");

    const tdProgram = document.createElement("td");
    tdProgram.textContent = app.program;
    tdProgram.setAttribute("data-label", "Program");

    const tdDate = document.createElement("td");
    tdDate.textContent = new Date(app.submittedOn).toLocaleDateString();
    tdDate.setAttribute("data-label", "Submitted");

    const tdStatus = document.createElement("td");
    tdStatus.innerHTML = `<span class="${getStatusBadgeClass(app.status)}">${app.status}</span>`;
    tdStatus.setAttribute("data-label", "Status");

    const tdActions = document.createElement("td");
    tdActions.className = "col-actions";
    tdActions.setAttribute("data-label", "Actions");
    tdActions.innerHTML = `
      <div class="btn-row">
        <button class="btn btn-approve" data-action="approve">Approve</button>
        <button class="btn btn-reject" data-action="reject">Reject</button>
      </div>
    `;

    tr.appendChild(tdName);
    tr.appendChild(tdProgram);
    tr.appendChild(tdDate);
    tr.appendChild(tdStatus);
    tr.appendChild(tdActions);
    tbody.appendChild(tr);
  }
}

function applyFilters() {
  const q = (searchInput.value || "").trim().toLowerCase();
  const status = statusFilter.value;
  const filtered = applications.filter((a) => {
    const matchesQuery = !q || a.name.toLowerCase().includes(q) || a.program.toLowerCase().includes(q);
    const matchesStatus = status === "all" ? true : a.status === status;
    return matchesQuery && matchesStatus;
  });
  renderRows(filtered);
}

function updateStatus(id, status) {
  applications = applications.map((a) => (a.id === id ? { ...a, status } : a));
  saveApplications(applications);
  applyFilters();
}

tbody.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const action = target.getAttribute("data-action");
  if (!action) return;
  const row = target.closest("tr");
  if (!row) return;
  const id = Number(row.getAttribute("data-id"));
  if (!id) return;
  if (action === "approve") {
    updateStatus(id, "approved");
    showToast("Application approved");
  } else if (action === "reject") {
    updateStatus(id, "rejected");
    showToast("Application rejected");
  }
});

searchInput.addEventListener("input", applyFilters);
statusFilter.addEventListener("change", applyFilters);

// Initial render
applyFilters();



