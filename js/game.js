// --- SINTETIZADOR DE SONIDO 32-BIT (WEB AUDIO API) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'attack') {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.18);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.start(now);
    osc.stop(now + 0.18);
  } else if (type === 'magic') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.setValueAtTime(650, now + 0.08);
    osc.frequency.setValueAtTime(850, now + 0.16);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
    osc.start(now);
    osc.stop(now + 0.28);
  } else if (type === 'heal') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.linearRampToValueAtTime(560, now + 0.3);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    osc.start(now);
    osc.stop(now + 0.3);
  } else if (type === 'hit') {
    osc.type = 'square';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.22);
    gain.gain.setValueAtTime(0.45, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

// --- DATOS DEL MODO CUENTO (ORDENADO POR JEFES) ---
const storyChapters = [
  {
    chapterTitle: "Capítulo 1: El Bosque Oscuro (Kaul)",
    bossId: "kaul",
    paragraphs: [
      { text: "Kaul avanza sigilosamente entre los árboles centenarios del Bosque Oscuro, donde la bruma oculta peligros inminentes.", img: "img/kaul.jpg" },
      { text: "Una figura con arco y flechas esmeralda emerge entre las sombras. ¡Es el arquero guardián del bosque!", img: "img/kaul.jpg" },
      { text: "Prepárate para un duelo de precisión y estrategia contra Kaul.", img: "img/kaul.jpg" }
    ]
  },
  {
    chapterTitle: "Capítulo 2: El Desierto de los Sueños (Arenigma)",
    bossId: "arenigma",
    paragraphs: [
      { text: "Tras cruzar el bosque, el calor abrasador del Desierto de los Sueños pone a prueba la resistencia de Kaul.", img: "img/arenigma.jpg" },
      { text: "De las dunas surge Arenigma, una esfinge alada capaz de manipular la arena dorada con furia ancestral.", img: "img/arenigma.jpg" },
      { text: "Resuelve el enigma de su poder superando este desafiante combate.", img: "img/arenigma.jpg" }
    ]
  },
  {
    chapterTitle: "Capítulo 3: La Entrada de la Fortaleza (Pesadrom)",
    bossId: "pesadrom",
    paragraphs: [
      { text: "La imponente fortaleza del Rey Osseus se alza en el horizonte. En sus puertas principales aguarda el temible hechicero.", img: "img/pesadrom.jpg" },
      { text: "Pesadrom canaliza flamas púrpuras y hechizos oscuros para bloquear el acceso.", img: "img/pesadrom.jpg" },
      { text: "Derrota al hechicero para abrir las puertas hacia el interior.", img: "img/pesadrom.jpg" }
    ]
  },
  {
    chapterTitle: "Capítulo 4: El Reino de las Pesadillas (Antasma)",
    bossId: "antasma",
    paragraphs: [
      { text: "En los pasillos internos donde residen las peores pesadillas, el cielo se tiñe de un violeta profundo.", img: "img/antasma.png" },
      { text: "Antasma despliega sus grandes alas espectrales y sus garras amenazantes en el Reino de las Pesadillas.", img: "img/antasma.png" },
      { text: "Enfréntate a este ente volador y demuestra tu valentía.", img: "img/antasma.png" }
    ]
  },
  {
    chapterTitle: "Capítulo 5: El Trono de la Fortaleza (Rey Osseus)",
    bossId: "osseus",
    paragraphs: [
      { text: "Has llegado al corazón de la fortaleza, el Trono del soberano absoluto de los restos caídos.", img: "img/rey_osseus.png" },
      { text: "El Rey Osseus alza su corona de oro y su cetro real con una mirada implacable.", img: "img/rey_osseus.png" },
      { text: "¡Lucha en la batalla final para liberar el reino de las sombras para siempre!", img: "img/rey_osseus.png" }
    ]
  }
];

// --- JEFES REGISTRADOS ---
const bossData = {
  kaul: { name: "Kaul", hp: 120, maxHp: 120, atk: 14, img: "img/kaul.jpg" },
  arenigma: { name: "Arenigma", hp: 140, maxHp: 140, atk: 16, img: "img/arenigma.jpg" },
  pesadrom: { name: "Pesadrom", hp: 170, maxHp: 170, atk: 19, img: "img/pesadrom.jpg" },
  antasma: { name: "Antasma", hp: 200, maxHp: 200, atk: 22, img: "img/antasma.png" },
  osseus: { name: "Rey Osseus", hp: 250, maxHp: 250, atk: 25, img: "img/rey_osseus.png" }
};

// --- ESTADO GLOBAL ---
let currentChapterIdx = 0;
let currentParagraphIdx = 0;

let player = { hp: 100, maxHp: 100, atk: 22, def: 6, isDefending: false };
let currentEnemy = { name: "", hp: 100, maxHp: 100, atk: 15, img: "" };

// --- NAVEGACIÓN DE PANTALLAS ---
function showScreen(screenId) {
  ['screen-start', 'screen-story-select', 'screen-story-reader', 'screen-boss-select', 'screen-battle', 'screen-bestiary'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.classList.add('hidden');
      el.classList.remove('flex');
    }
  });
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.remove('hidden');
    target.classList.add('flex');
  }
}

function returnToStart() {
  showScreen('screen-start');
}

// --- LÓGICA DEL MODO CUENTO ---
function startStoryChapter(chapterIdx) {
  currentChapterIdx = chapterIdx;
  currentParagraphIdx = 0;
  updateStoryReaderUI();
  showScreen('screen-story-reader');
}

function updateStoryReaderUI() {
  const chap = storyChapters[currentChapterIdx];
  const p = chap.paragraphs[currentParagraphIdx];

  document.getElementById('story-chapter-title').innerText = chap.chapterTitle;
  document.getElementById('story-text').innerText = p.text;
  document.getElementById('story-img').src = p.img;

  document.getElementById('story-prev-btn').style.visibility = currentParagraphIdx === 0 ? 'hidden' : 'visible';
  
  const nextBtn = document.getElementById('story-next-btn');
  if (currentParagraphIdx === chap.paragraphs.length - 1) {
    nextBtn.innerText = "⚔️ ENFRENTAR JEFE";
  } else {
    nextBtn.innerText = "SIGUIENTE";
  }
}

function prevStoryParagraph() {
  if (currentParagraphIdx > 0) {
    currentParagraphIdx--;
    updateStoryReaderUI();
  }
}

function nextStoryParagraph() {
  const chap = storyChapters[currentChapterIdx];
  if (currentParagraphIdx < chap.paragraphs.length - 1) {
    currentParagraphIdx++;
    updateStoryReaderUI();
  } else {
    startBossBattle(chap.bossId);
  }
}

// --- LÓGICA MODO COMBATE DE JEFES ---
function startBossBattle(bossKey) {
  const boss = bossData[bossKey];
  currentEnemy = { ...boss };

  player.hp = player.maxHp;
  player.isDefending = false;

  document.getElementById('enemy-name').innerText = currentEnemy.name;
  document.getElementById('enemy-img').src = currentEnemy.img;

  updateBattleUI();
  showScreen('screen-battle');
  logMessage(`¡Has desafiado a ${currentEnemy.name}!`);
}

function updateBattleUI() {
  const playerPct = Math.max(0, (player.hp / player.maxHp) * 100);
  document.getElementById('player-hp-bar').style.width = playerPct + '%';
  document.getElementById('player-hp-text').innerText = `${player.hp} / ${player.maxHp} HP`;

  const enemyPct = Math.max(0, (currentEnemy.hp / currentEnemy.maxHp) * 100);
  document.getElementById('enemy-hp-bar').style.width = enemyPct + '%';
  document.getElementById('enemy-hp-text').innerText = `${currentEnemy.hp} / ${currentEnemy.maxHp} HP`;
}

function logMessage(msg) {
  const log = document.getElementById('battle-log');
  const p = document.createElement('p');
  p.innerText = "> " + msg;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight;
}

function playerAction(action) {
  player.isDefending = false;

  if (action === 'attack') {
    playSound('attack');
    let dmg = Math.floor(player.atk + (Math.random() * 6));
    currentEnemy.hp -= dmg;
    logMessage(`Atacas a ${currentEnemy.name} causando ${dmg} de daño directo.`);
    triggerDamageEffect('enemy-sprite-box');
  } else if (action === 'magic') {
    playSound('magic');
    let dmg = Math.floor(player.atk * 1.5);
    currentEnemy.hp -= dmg;
    logMessage(`Lanzas magia arcana 32-bit e infliges ${dmg} de daño.`);
    triggerDamageEffect('enemy-sprite-box');
  } else if (action === 'heal') {
    playSound('heal');
    let healVal = 35;
    player.hp = Math.min(player.maxHp, player.hp + healVal);
    logMessage(`Kaul usa una poción y recupera ${healVal} de vida.`);
  } else if (action === 'defend') {
    player.isDefending = true;
    logMessage(`Kaul se pone en guardia. Sufrirá menos daño.`);
  }

  updateBattleUI();

  if (currentEnemy.hp <= 0) {
    logMessage(`¡Has derrotado a ${currentEnemy.name}!`);
    setTimeout(() => {
      alert(`¡VICTORIA! Has superado al jefe ${currentEnemy.name}.`);
      returnToStart();
    }, 1200);
    return;
  }

  setTimeout(enemyTurn, 1000);
}

function enemyTurn() {
  playSound('hit');
  let baseDmg = currentEnemy.atk + Math.floor(Math.random() * 5);
  if (player.isDefending) {
    baseDmg = Math.floor(baseDmg / 2);
  }

  player.hp -= baseDmg;
  logMessage(`${currentEnemy.name} arremete contra Kaul causando ${baseDmg} de daño.`);
  triggerDamageEffect('player-sprite-box');

  updateBattleUI();

  if (player.hp <= 0) {
    logMessage(`Kaul ha caído en combate...`);
    setTimeout(() => {
      alert("GAME OVER: Las sombras han triunfado.");
      returnToStart();
    }, 1200);
  }
}

function triggerDamageEffect(elementId) {
  const el = document.getElementById(elementId);
  if (el) {
    el.classList.add('damage-flash');
    setTimeout(() => el.classList.remove('damage-flash'), 350);
  }
}
