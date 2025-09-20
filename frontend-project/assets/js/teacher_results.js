// Teacher Results & Rankings JS

let students = [
  { name: "Aman Kumar", institute: "Delhi Public", score: 91 },
  { name: "Rhea Sharma", institute: "Delhi Public", score: 85 },
  { name: "Arjun Verma", institute: "Sunrise Academy", score: 88 },
  { name: "Neha Gupta", institute: "Delhi Public", score: 74 },
  { name: "Rajesh Singh", institute: "Greenfield", score: 95 },
  { name: "Simran Kaur", institute: "Greenfield", score: 95 },
  { name: "Priya Patel", institute: "Sunrise Academy", score: 80 }
];

let published = false;

const publishBtn = document.getElementById("publishBtn");
const viewSelect = document.getElementById("viewSelect");
const instituteSelect = document.getElementById("instituteSelect");
const rankTableBody = document.querySelector("#rankTable tbody");
const exportBtn = document.getElementById("exportBtn");

// Fill institute dropdown
function fillInstitutes() {
  const insts = [...new Set(students.map(s => s.institute))];
  instituteSelect.innerHTML = "";
  insts.forEach(inst => {
    const opt = document.createElement("option");
    opt.value = inst;
    opt.textContent = inst;
    instituteSelect.appendChild(opt);
  });
}

// Render table
function renderTable() {
  rankTableBody.innerHTML = "";
  if (!published) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 4;
    td.textContent = "Results not published yet.";
    tr.appendChild(td);
    rankTableBody.appendChild(tr);
    return;
  }

  let data = [...students];
  if (viewSelect.value === "institute") {
    instituteSelect.style.display = "inline-block";
    data = data.filter(s => s.institute === instituteSelect.value);
  } else {
    instituteSelect.style.display = "none";
  }

  data.sort((a, b) => b.score - a.score);

  let lastScore = null, lastRank = 0;
  data.forEach((s, i) => {
    if (s.score !== lastScore) {
      lastRank = i + 1;
      lastScore = s.score;
    }
    const tr = document.createElement("tr");
    let cls = "";
    if (lastRank === 1) cls = "gold";
    else if (lastRank === 2) cls = "silver";
    else if (lastRank === 3) cls = "bronze";

    tr.innerHTML = `
      <td class="${cls}">#${lastRank}</td>
      <td>${s.name}</td>
      <td>${s.institute}</td>
      <td>${s.score}</td>
    `;
    rankTableBody.appendChild(tr);
  });
}

// Button events
publishBtn.addEventListener("click", () => {
  if (!published) {
    if (!confirm("Publish results?")) return;
  } else {
    if (!confirm("Unpublish results?")) return;
  }
  published = !published;
  publishBtn.textContent = published ? "Unpublish Results" : "Publish Results";
  publishBtn.className = published ? "btn btn-danger" : "btn btn-primary";
  renderTable();
});

viewSelect.addEventListener("change", renderTable);
instituteSelect.addEventListener("change", renderTable);

exportBtn.addEventListener("click", () => {
  if (!published) {
    alert("Publish results first!");
    return;
  }
  const rows = document.querySelectorAll("#rankTable tr");
  let csv = [];
  rows.forEach(r => {
    let cols = r.querySelectorAll("td,th");
    let row = [];
    cols.forEach(c => row.push('"' + c.innerText + '"'));
    csv.push(row.join(","));
  });
  const blob = new Blob([csv.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "results_export.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Init
fillInstitutes();
renderTable();