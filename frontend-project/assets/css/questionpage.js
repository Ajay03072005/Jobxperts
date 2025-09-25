
(() => {
  let questions = [];
  let nextId = 1;
  function showModal() {
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';  
}
function hideModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = '';        
}
  const btnAdd = document.getElementById('btnAdd');
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const cancelBtn = document.getElementById('cancel');
  const qForm = document.getElementById('questionForm');
  const modalTitle = document.getElementById('modalTitle');

  const qId = document.getElementById('qId');
  const qType = document.getElementById('qType');
  const qText = document.getElementById('qText');
  const optionsWrap = document.getElementById('optionsWrap');
  const addOption = document.getElementById('addOption');
  const mcqOptions = document.getElementById('mcqOptions');
  const tfOption = document.getElementById('tfOption');
  const tfCorrect = document.getElementById('tfCorrect');
  const qTags = document.getElementById('qTags');
  const qDifficulty = document.getElementById('qDifficulty');
  const qExplanation = document.getElementById('qExplanation');
  const qImage = document.getElementById('qImage');
  const imagePreview = document.getElementById('imagePreview');

  const questionsList = document.getElementById('questionsList');
  const tpl = document.getElementById('questionCardTpl');

  
  const filterType = document.getElementById('filterType');
  const filterDiff = document.getElementById('filterDiff');
  const filterTag = document.getElementById('filterTag');
  const searchText = document.getElementById('searchText');
  const clearFilters = document.getElementById('clearFilters');

  
  const csvFileInput = document.getElementById('csvFileInput');
  const downloadTemplate = document.getElementById('downloadTemplate');

 
  function init() {
    btnAdd.addEventListener('click', openAddModal);
    closeModal.addEventListener('click', hideModal);
    cancelBtn.addEventListener('click', hideModal);
    qType.addEventListener('change', handleTypeChange);
    addOption.addEventListener('click', addOptionRow);
    qForm.addEventListener('submit', saveQuestion);
    qImage.addEventListener('change', handleImagePreview);

    filterType.addEventListener('change', renderQuestions);
    filterDiff.addEventListener('change', renderQuestions);
    filterTag.addEventListener('change', renderQuestions);
    searchText.addEventListener('input', renderQuestions);
    clearFilters.addEventListener('click', clearAllFilters);

    csvFileInput.addEventListener('change', handleCSVImport);
    downloadTemplate.addEventListener('click', downloadCSVTemplate);

    
    addOptionRow();
    renderQuestions();
  }

  
  function openAddModal() {
    resetForm();
    modalTitle.textContent = 'Add Question';
    showModal();
  }
  function showModal() { modal.classList.remove('hidden'); }
 function hideModal() {
  document.getElementById('modal').classList.add('hidden');
}

  function resetForm() {
    qId.value = '';
    qType.value = 'mcq';
    qText.value = '';
    qTags.value = '';
    qDifficulty.value = 'Easy';
    qExplanation.value = '';
    tfCorrect.value = 'true';
    qImage.value = '';
    imagePreview.innerHTML = '';
    optionsWrap.innerHTML = '';
    addOptionRow();
    handleTypeChange();
  }

  function handleTypeChange() {
    if (qType.value === 'mcq') {
      mcqOptions.classList.remove('hidden');
      tfOption.classList.add('hidden');
    } else {
      mcqOptions.classList.add('hidden');
      tfOption.classList.remove('hidden');
    }
  }

  
  function addOptionRow(text = '', checked = false) {
    const idx = optionsWrap.children.length;
    const row = document.createElement('div');
    row.className = 'option-row';
    row.dataset.idx = idx;

    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'correctOption';
    radio.checked = checked;

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = `Option ${idx + 1}`;
    input.value = text;

    const del = document.createElement('button');
    del.type = 'button';
    del.textContent = '✕';
    del.title = 'Remove option';
    del.addEventListener('click', () => {
      row.remove();
      Array.from(optionsWrap.children).forEach((r, i) => {
        r.dataset.idx = i;
        r.querySelector('input[type="text"]').placeholder = `Option ${i + 1}`;
      });
    });

    row.appendChild(radio);
    row.appendChild(input);
    row.appendChild(del);
    optionsWrap.appendChild(row);
  }
  function handleImagePreview(e) {
    imagePreview.innerHTML = '';
    const f = e.target.files[0];
    if (!f) return;
    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    img.onload = () => URL.revokeObjectURL(img.src);
    imagePreview.appendChild(img);
  }
  function saveQuestion(evt) {
    evt.preventDefault();
    const id = qId.value ? Number(qId.value) : null;
    const type = qType.value;
    const text = qText.value.trim();
    if (!text) return alert('Question text is required');

    let question = {
      id: id || nextId++,
      type,
      text,
      tags: qTags.value.split(',').map(s => s.trim()).filter(Boolean),
      difficulty: qDifficulty.value,
      explanation: qExplanation.value.trim(),
      imageDataUrl: null
    };

    if (type === 'mcq') {
      const rows = Array.from(optionsWrap.children);
      const options = rows.map(r => r.querySelector('input[type="text"]').value.trim());
      const radios = rows.map(r => r.querySelector('input[type="radio"]'));
      const correctIndex = radios.findIndex(r => r.checked);
      if (options.length < 2) return alert('MCQ requires at least 2 options');
      if (correctIndex === -1) return alert('Select the correct option for MCQ');
      question.options = options;
      question.correct = correctIndex;
    } else {
      question.correct = (tfCorrect.value === 'true');
      question.options = ['True', 'False'];
    }
    const file = qImage.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        question.imageDataUrl = ev.target.result;
        upsertQuestion(question, id);
      };
      reader.readAsDataURL(file);
    } else {
      upsertQuestion(question, id);
    }
  }

  function upsertQuestion(question, existingId) {
    if (existingId) {
      const idx = questions.findIndex(q => q.id === existingId);
      if (idx >= 0) questions[idx] = question;
    } else {
      questions.unshift(question); 
    }
    hideModal();
    refreshTagFilter();
    renderQuestions();
  }
  function renderQuestions() {
    questionsList.innerHTML = '';
    const filtered = applyFilters(questions);
    if (filtered.length === 0) {
      questionsList.innerHTML = '<p class="muted">No questions yet. Add one or import CSV.</p>';
      return;
    }
    filtered.forEach(q => {
      const el = tpl.content.cloneNode(true);
      const card = el.querySelector('.question-card');
      card.querySelector('.q-text').textContent = q.text;
      card.querySelector('.difficulty').textContent = q.difficulty;
      card.querySelector('.type').textContent = q.type.toUpperCase();
      card.querySelector('.taglist').textContent = q.tags.join(', ') || '—';
      const body = card.querySelector('.q-body');
      if (q.type === 'mcq') {
        const ul = document.createElement('ul');
        q.options.forEach((opt, i) => {
          const li = document.createElement('li');
          li.textContent = (i === q.correct ? `✅ ${opt}` : opt);
          ul.appendChild(li);
        });
        body.appendChild(ul);
      } else {
        body.textContent = `Answer: ${q.correct ? 'True' : 'False'}`;
      }
      if (q.explanation) {
        const ex = document.createElement('div');
        ex.style.marginTop = '8px';
        ex.style.fontSize = '13px';
        ex.style.color = '#bcd';
        ex.textContent = `Explanation: ${q.explanation}`;
        body.appendChild(ex);
      }
      if (q.imageDataUrl) {
        const img = document.createElement('img');
        img.src = q.imageDataUrl;
        img.style.maxWidth = '140px';
        img.style.display = 'block';
        img.style.marginTop = '8px';
        img.style.borderRadius = '8px';
        body.appendChild(img);
      }

      const editBtn = card.querySelector('.edit');
      const delBtn = card.querySelector('.delete');

      editBtn.addEventListener('click', () => openEditModal(q.id));
      delBtn.addEventListener('click', () => {
        if (!confirm('Delete this question?')) return;
        questions = questions.filter(x => x.id !== q.id);
        renderQuestions();
        refreshTagFilter();
      });

      questionsList.appendChild(el);
    });
  }

  function openEditModal(id) {
    const q = questions.find(x => x.id === id);
    if (!q) return;
    qId.value = q.id;
    qType.value = q.type;
    qText.value = q.text;
    qTags.value = q.tags.join(',');
    qDifficulty.value = q.difficulty || 'Easy';
    qExplanation.value = q.explanation || '';
    imagePreview.innerHTML = '';
    qImage.value = '';

    optionsWrap.innerHTML = '';
    if (q.type === 'mcq') {
      q.options.forEach((opt, i) => addOptionRow(opt, i === q.correct));
    } else {
      addOptionRow(); 
      tfCorrect.value = q.correct ? 'true' : 'false';
    }
    handleTypeChange();
    modalTitle.textContent = 'Edit Question';
    showModal();
    if (q.imageDataUrl) {
      const img = document.createElement('img');
      img.src = q.imageDataUrl;
      imagePreview.appendChild(img);
    }
  }
  function applyFilters(list) {
    const type = filterType.value;
    const diff = filterDiff.value;
    const tag = filterTag.value;
    const s = searchText.value.trim().toLowerCase();

    return list.filter(q => {
      if (type && q.type !== type) return false;
      if (diff && q.difficulty !== diff) return false;
      if (tag && !q.tags.includes(tag)) return false;
      if (s) {
        const hay = (q.text + ' ' + q.tags.join(' ') + ' ' + (q.explanation || '')).toLowerCase();
        if (!hay.includes(s)) return false;
      }
      return true;
    });
  }

  function refreshTagFilter() {
    const tags = Array.from(new Set(questions.flatMap(q => q.tags || []))).sort();
    filterTag.innerHTML = '<option value="">All</option>';
    tags.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t; opt.textContent = t;
      filterTag.appendChild(opt);
    });
  }

  function clearAllFilters() {
    filterType.value = '';
    filterDiff.value = '';
    filterTag.value = '';
    searchText.value = '';
    renderQuestions();
  }
  function handleCSVImport(ev) {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const text = e.target.result;
      const rows = parseCSV(text);
      let imported = 0;
      rows.forEach(r => {
        const type = (r[0] || '').trim().toLowerCase();
        const textq = (r[1] || '').trim();
        if (!type || !textq) return;
        const optionsCell = (r[2] || '').trim();
        const tags = (r[3] || '').split('|').map(s => s.trim()).filter(Boolean);
        const diff = r[4] || 'Easy';
        const expl = r[5] || '';

        const q = {
          id: nextId++,
          type: type === 'tf' ? 'tf' : 'mcq',
          text: textq,
          tags,
          difficulty: diff,
          explanation: expl,
          imageDataUrl: null
        };

        if (q.type === 'mcq') {
          const parts = optionsCell.split('|');
          let correct = -1;
          const opts = parts.filter(p => {
            if (p.startsWith('#')) {
              correct = Number(p.slice(1));
              return false;
            }
            return true;
          });
          if (opts.length === 0 && parts.length > 0) {
            const last = parts[parts.length - 1];
            if (last.startsWith('#')) {
              correct = Number(last.slice(1));
              opts.splice(-1,1);
            }
          }
          if (opts.length >= 2) {
            q.options = opts;
            q.correct = (correct >= 0 ? correct : 0);
          } else {
            return;
          }
        } else {
          q.options = ['True', 'False'];
          q.correct = true;
        }

        questions.push(q);
        imported++;
      });

      if (imported) {
        refreshTagFilter();
        renderQuestions();
        alert(`${imported} questions imported.`);
      } else {
        alert('No valid rows imported. Check CSV format.');
      }
    };
    reader.readAsText(file, 'utf-8');
    ev.target.value = '';
  }
  function parseCSV(text) {
    const lines = [];
    let cur = [];
    let i = 0;
    let field = '';
    let inQuotes = false;

    while (i < text.length) {
      const ch = text[i];

      if (inQuotes) {
        if (ch === '"') {
          if (text[i+1] === '"') { field += '"'; i += 2; continue; }
          inQuotes = false; i++; continue;
        }
        field += ch; i++; continue;
      }

      if (ch === '"') {
        inQuotes = true; i++; continue;
      }

      if (ch === ',') {
        cur.push(field); field = ''; i++; continue;
      }

      if (ch === '\r') { i++; continue; }
      if (ch === '\n') {
        cur.push(field);
        lines.push(cur);
        cur = []; field = ''; i++; continue;
      }

      field += ch; i++;
    }
    if (field !== '' || inQuotes || cur.length > 0) {
      cur.push(field);
      lines.push(cur);
    }
    return lines.filter(r => r.length && r.some(c => c.trim() !== ''));
  }

  function downloadCSVTemplate() {
    const header = 'type,text,options,tags,difficulty,explanation\n';
    const mcqRow = 'mcq,"What is 2+2?","1|2|3|4|#3",math|arithmetic,Easy,"2+2 = 4"\n';
    const tfRow = 'tf,"The earth is flat",,geography,Easy,"False"\n';
    const blob = new Blob([header + mcqRow + tfRow], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'questions_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  }
  init();
})();
