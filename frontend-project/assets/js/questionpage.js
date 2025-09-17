const form = document.getElementById('questionForm');
const questionList = document.getElementById('questionList');
const typeSelect = document.getElementById('type');
const mcqOptions = document.getElementById('mcqOptions');

typeSelect.addEventListener('change', () => {
  mcqOptions.style.display = typeSelect.value === 'MCQ' ? 'block' : 'none';
}
);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const question = document.getElementById('question').value;
  const answer = document.getElementById('answer').value;
  const tags = document.getElementById('tags').value;
  const difficulty = document.getElementById('difficulty').value;
  const explanation = document.getElementById('explanation').value;
  const type = typeSelect.value;

  const options = Array.from(document.querySelectorAll('.option')).map(opt => opt.value);

  const card = document.createElement('div');
  card.className = 'question-card';
  card.innerHTML = `
    <strong>Type:</strong> ${type}<br>
    <strong>Q:</strong> ${question}<br>
    ${type === 'MCQ' ? `<strong>Options:</strong> ${options.join(', ')}<br>` : ''}
    <strong>Answer:</strong> ${answer}<br>
    <strong>Tags:</strong> ${tags}<br>
    <strong>Difficulty:</strong> ${difficulty}<br>
    <strong>Explanation:</strong> ${explanation || '—'}
    <button onclick="this.parentElement.remove()">🗑 Delete</button>
  `;
  questionList.appendChild(card);

  form.reset();
  mcqOptions.style.display = 'block';
}
);
