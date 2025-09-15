// Mock data (replace with API later)
const questions = [
  {
    id: 1,
    text: "What is 2 + 2?",
    options: ["2", "3", "4", "5"],
    correct: 2
  },
  {
    id: 2,
    text: "React is a ____?",
    options: ["Library", "Framework", "Language", "Database"],
    correct: 0
  }
];

let currentIndex = 0;
let responses = {}; // { questionId: optionIndex }
let markedForReview = new Set();
let duration = 60 * 5; // 5 minutes

// Timer
let timerInterval;
function startTimer() {
  const timerEl = document.getElementById("timer");
  timerInterval = setInterval(() => {
    let minutes = Math.floor(duration / 60);
    let seconds = duration % 60;
    timerEl.textContent = `${minutes}:${seconds.toString().padStart(2, "0")}`;
    if (duration <= 0) {
      clearInterval(timerInterval);
      autoSubmit();
    }
    duration--;
  }, 1000);
}

// Load question
function loadQuestion(index) {
  const q = questions[index];
  document.getElementById("question-text").textContent = q.text;

  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";
  q.options.forEach((opt, i) => {
    const id = `q${q.id}_opt${i}`;
    optionsDiv.innerHTML += `
      <label>
        <input type="radio" name="q${q.id}" value="${i}" ${responses[q.id] === i ? "checked" : ""}>
        ${opt}
      </label>
    `;
  });

  document.querySelectorAll(`#options input`).forEach((el) => {
    el.addEventListener("change", (e) => {
      responses[q.id] = parseInt(e.target.value);
      document.querySelector(`#btn-${q.id}`).classList.add("answered");
    });
  });
}

// Render navigation
function renderNav() {
  const navDiv = document.getElementById("question-list");
  navDiv.innerHTML = "";
  questions.forEach((q) => {
    const btn = document.createElement("button");
    btn.id = `btn-${q.id}`;
    btn.textContent = q.id;
    btn.onclick = () => {
      currentIndex = q.id - 1;
      loadQuestion(currentIndex);
    };
    navDiv.appendChild(btn);
  });
}

// Controls
document.getElementById("next-btn").onclick = () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    loadQuestion(currentIndex);
  }
};

document.getElementById("prev-btn").onclick = () => {
  if (currentIndex > 0) {
    currentIndex--;
    loadQuestion(currentIndex);
  }
};

document.getElementById("mark-btn").onclick = () => {
  const q = questions[currentIndex];
  markedForReview.add(q.id);
  document.querySelector(`#btn-${q.id}`).classList.add("review");
};

document.getElementById("clear-btn").onclick = () => {
  const q = questions[currentIndex];
  delete responses[q.id];
  loadQuestion(currentIndex);
  document.querySelector(`#btn-${q.id}`).classList.remove("answered");
};

// Submit
document.getElementById("submit-btn").onclick = () => {
  if (confirm("Are you sure you want to submit?")) {
    autoSubmit();
  }
};

// Auto submit
function autoSubmit() {
  clearInterval(timerInterval);
  alert("Test Submitted!");
  console.log("Responses:", responses);
  // TODO: send to backend
}

// Tab switch warning
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    alert("Warning: You switched tabs. This may be logged!");
  }
});

// Init
renderNav();
loadQuestion(currentIndex);
startTimer();

