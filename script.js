/* All activity data stays in memory. No network calls or browser storage. */
(() => {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const binary = (letter) => letter.charCodeAt(0).toString(2).padStart(8, '0');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nameInput = $('#name');
  let letters = '';

  // Accessible compact navigation.
  $('.menu-toggle').addEventListener('click', () => {
    const expanded = $('.menu-toggle').getAttribute('aria-expanded') !== 'true';
    $('.menu-toggle').setAttribute('aria-expanded', String(expanded));
    $('#nav-links').classList.toggle('open', expanded);
  });
  function closeMenu() {
    $('.menu-toggle').setAttribute('aria-expanded', 'false');
    $('#nav-links').classList.remove('open');
  }
  $('#nav-links').addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && $('#nav-links').classList.contains('open')) { closeMenu(); $('.menu-toggle').focus(); }
  });

  // Each ASCII letter produces exactly eight labeled beads, in reading order.
  function renderBracelet() {
    const raw = nameInput.value;
    const invalid = /[^a-zA-Z]/.test(raw);
    letters = raw.replace(/[^a-zA-Z]/g, '').toUpperCase();
    $('#input-feedback').textContent = invalid ? 'Use letters A–Z only. Spaces, numbers, and symbols are skipped; only supported letters appear below.' : '';
    $('#copy-status').textContent = '';
    $('#copy-fallback').hidden = true;
    const output = $('#bracelet-output');
    output.replaceChildren();
    if (!letters) {
      const empty = document.createElement('p');
      empty.className = 'empty';
      empty.textContent = 'Your next creation starts with a letter. Type above to see your binary beads ✨';
      output.append(empty);
    }
    for (const letter of letters) {
      const code = binary(letter);
      const group = document.createElement('div');
      group.className = 'letter-group';
      const caption = document.createElement('div');
      caption.className = 'letter-caption';
      const label = document.createElement('strong'); label.textContent = letter;
      const text = document.createElement('code'); text.textContent = code;
      caption.append(label, text);
      const beads = document.createElement('div'); beads.className = 'beads';
      beads.setAttribute('aria-label', `${letter}: ${code.split('').join(', ')}`);
      for (const bit of code) {
        const bead = document.createElement('span');
        bead.className = `bead${bit === '1' ? ' one' : ''}`;
        bead.textContent = bit;
        bead.setAttribute('aria-hidden', 'true');
        beads.append(bead);
      }
      group.append(caption, beads); output.append(group);
    }
    $('#copy').disabled = letters.length === 0;
    updateColors();
  }
  function updateColors() {
    document.documentElement.style.setProperty('--zero', $('#zero-color').value);
    document.documentElement.style.setProperty('--one', $('#one-color').value);
    // Keep bit labels readable even when a student chooses a very dark color.
    document.querySelectorAll('.bead').forEach((bead) => {
      const color = $(bead.classList.contains('one') ? '#one-color' : '#zero-color').value;
      const rgb = [1, 3, 5].map((offset) => parseInt(color.slice(offset, offset + 2), 16) / 255);
      const linear = rgb.map((c) => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
      const luminance = .2126 * linear[0] + .7152 * linear[1] + .0722 * linear[2];
      bead.style.color = luminance > .179 ? '#000000' : '#ffffff';
    });
  }
  nameInput.addEventListener('input', renderBracelet);
  ['#zero-color', '#one-color'].forEach((id) => $(id).addEventListener('input', updateColors));
  $('#reset').addEventListener('click', () => {
    nameInput.value = ''; $('#zero-color').value = '#c7aff0'; $('#one-color').value = '#f39ac2';
    renderBracelet(); nameInput.focus();
  });
  $('#copy').addEventListener('click', async () => {
    const text = [...letters].map((letter) => `${letter} → ${binary(letter)}`).join('\n');
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(text);
      $('#copy-status').textContent = 'Copied! Your secret code is ready! 💗';
    } catch {
      const fallback = $('#copy-fallback'); fallback.value = text; fallback.hidden = false; fallback.focus(); fallback.select();
      let copied = false;
      try { copied = document.execCommand('copy'); } catch { /* Manual selection remains available. */ }
      $('#copy-status').textContent = copied ? 'Copied! Your secret code is ready! 💗' : 'Your code is selected below. Use Copy from your device’s menu, or press Ctrl+C / Command+C.';
    }
  });
  for (const letter of alphabet) {
    const item = document.createElement('div');
    const label = document.createElement('strong'); label.textContent = letter;
    const code = document.createElement('span'); code.textContent = binary(letter);
    item.append(label, code); $('#alphabet-grid').append(item);
  }

  // Independent quizzes: one success in each category earns a star.
  const bugs = [
    { code: 'MOVE FORWARD\nMOVE FORWARD', question: 'The robot needs to move 3 steps. What’s missing?', answers: ['Move forward one more time.', 'Turn left.', 'Jump.', 'Stop.'], correct: 0, explanation: 'One MOVE FORWARD is one step. Three steps need three instructions.' },
    { code: 'TURN LEFT\nMOVE FORWARD', question: 'The robot should turn RIGHT, then move. What needs fixing?', answers: ['Remove MOVE FORWARD.', 'Change LEFT to RIGHT.', 'Add a jump.', 'Stop first.'], correct: 1, explanation: 'Change the direction to RIGHT, then keep the forward instruction.' },
    { code: 'REPEAT 2 TIMES:\n  CLAP', question: 'We want 4 claps. Which change fixes the loop?', answers: ['Repeat 1 time.', 'Say hello.', 'Repeat 4 times.', 'Remove CLAP.'], correct: 2, explanation: 'A loop repeats its instructions. Repeating CLAP four times makes four claps.' },
    { code: 'PUT ON SHOES\nPUT ON SOCKS', question: 'Getting ready feels tricky! How do we fix the order?', answers: ['Add a jump.', 'Wear two shoes.', 'Remove the socks.', 'Put on socks before shoes.'], correct: 3, explanation: 'Order matters in a sequence. Socks come before shoes.' },
    { code: 'MOVE FORWARD\nMOVE FORWARD\nMOVE FORWARD\nMOVE FORWARD', question: 'The robot’s goal is only 3 steps away. What’s the bug?', answers: ['There is one extra move.', 'It needs two more moves.', 'It needs to turn.', 'There are too few moves.'], correct: 0, explanation: 'Four moves go one step too far. Remove one MOVE FORWARD.' }
  ];
  const logic = [
    { code: 'IF it is raining:\n  Bring an umbrella\nELSE:\n  Wear sunglasses', question: 'It is raining. What should you bring?', answers: ['Sunglasses.', 'An umbrella.', 'A beach ball.', 'Nothing.'], correct: 1, explanation: 'The condition is true, so follow the IF instruction: bring an umbrella.' },
    { code: 'IF homework is finished:\n  Play a game\nELSE:\n  Finish homework', question: 'Homework is NOT finished. What happens next?', answers: ['Play a game.', 'Skip it.', 'Finish homework.', 'Do both at once.'], correct: 2, explanation: 'When the condition is false, follow the ELSE instruction.' },
    { code: '1. Pick a seed\n2. Plant the seed\n3. Water the soil', question: 'What comes immediately after picking a seed?', answers: ['Water the soil.', 'Pick another seed.', 'Watch a flower bloom.', 'Plant the seed.'], correct: 3, explanation: 'A sequence follows a specific order. Step 2 is planting the seed.' },
    { code: 'REPEAT 3 TIMES:\n  JUMP\n  CLAP', question: 'How many claps happen in total?', answers: ['3 claps.', '6 claps.', '1 clap.', '0 claps.'], correct: 0, explanation: 'Each round includes one clap. Three rounds make three claps (and three jumps!).' },
    { code: 'Goal: make a jam sandwich', question: 'Which algorithm puts the steps in a useful order?', answers: ['Eat → spread jam → get bread.', 'Get bread → spread jam → put slices together.', 'Spread jam → get bread → eat.', 'Put slices together → get bread.'], correct: 1, explanation: 'An algorithm is a step-by-step plan. Gather bread before spreading jam and assembling.' }
  ];
  function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
  const quizzes = [
    { title: 'Decode the Secret Message', icon: '✉', color: 'pink', description: 'Match the binary code to a letter. The alphabet chart above can help!', index: 0 },
    { title: 'Find the Bug!', icon: '🐛', color: 'mint', description: 'Debugging means finding and fixing mistakes in code. You’ve got this!', index: 0, bank: shuffle(bugs) },
    { title: 'Think Like a Programmer!', icon: '💡', color: 'blue', description: 'Explore conditions, sequences, loops, and step-by-step plans.', index: 0, bank: shuffle(logic) }
  ];
  const completed = new Set();
  function decodeQuestion() {
    const letter = alphabet[Math.floor(Math.random() * 26)];
    const answers = shuffle([letter, ...shuffle([...alphabet].filter((x) => x !== letter)).slice(0, 3)]);
    return { code: binary(letter), question: 'What letter does this binary code represent?', answers, correct: answers.indexOf(letter), explanation: `${letter} has the uppercase ASCII code ${binary(letter)}. Every digit is one bit!` };
  }
  function renderQuiz(quiz, index) {
    const question = quiz.bank ? quiz.bank[quiz.index % quiz.bank.length] : decodeQuestion();
    const card = quiz.element || document.createElement('article');
    if (!quiz.element) { card.className = 'quiz'; $('#quiz-grid').append(card); quiz.element = card; }
    card.innerHTML = `<span class="quiz-icon ${quiz.color}" aria-hidden="true">${quiz.icon}</span><p class="eyebrow">CHALLENGE 0${index + 1}</p><h3>${quiz.title}</h3><p class="quiz-description">${quiz.description}</p><pre class="question-code"></pre><p class="question-text"></p><div class="choices"></div><p class="quiz-feedback" aria-live="polite"></p><button class="next">Next Challenge →<span class="sr-only"> in ${quiz.title}</span></button>`;
    card.querySelector('.question-code').textContent = question.code;
    card.querySelector('.question-text').textContent = question.question;
    let solved = false;
    question.answers.forEach((answer, answerIndex) => {
      const button = document.createElement('button'); button.className = 'choice'; button.textContent = answer;
      button.addEventListener('click', () => {
        if (solved) return;
        if (answerIndex === question.correct) {
          solved = true; button.classList.add('correct');
          card.querySelector('.quiz-feedback').textContent = `🎉 Amazing! You cracked the code! ${question.explanation}`;
          card.querySelectorAll('.choice').forEach((choice) => { choice.disabled = true; });
          completed.add(index); updateProgress();
        } else {
          button.classList.add('incorrect'); button.disabled = true;
          card.querySelector('.quiz-feedback').textContent = 'Almost! Try again, future coder! Read the instructions carefully, or check the alphabet chart.';
        }
      }); card.querySelector('.choices').append(button);
    });
    card.querySelector('.next').addEventListener('click', () => {
      quiz.index++; renderQuiz(quiz, index); card.querySelector('.choice').focus();
    });
  }
  let celebrated = false;
  function updateProgress() {
    const count = completed.size;
    $('#stars').textContent = quizzes.map((_, i) => completed.has(i) ? '★' : '☆').join(' ');
    $('#stars').setAttribute('aria-label', `${count} of 3 challenges completed`);
    $('#progress').value = count; $('#progress-label').textContent = `${count} / 3 challenges`;
    if (count === 3 && !celebrated) {
      celebrated = true; $('#reward').hidden = false; $('#reward').setAttribute('role', 'status');
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        for (let i = 0; i < 30; i++) {
          const piece = document.createElement('i'); piece.className = 'confetti'; piece.setAttribute('aria-hidden', 'true');
          piece.style.left = `${Math.random() * 100}%`; piece.style.background = ['#a985cd', '#ed9ac0', '#e5c269', '#79bfa6'][i % 4];
          piece.style.animationDelay = `${Math.random() * .5}s`; $('#reward').append(piece);
          piece.addEventListener('animationend', () => piece.remove());
        }
      }
    }
  }
  quizzes.forEach(renderQuiz); renderBracelet();
})();
