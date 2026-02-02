/* ======================================================
   CONFIGURACIÓN E IDIOMAS
====================================================== */
const messagesByLang = {
  es: [
    "FELIZ CUMPLEAÑOS - ES",
    "GIOVANA MALDONADO"
  ],

  fr: [
    "JOYEUX ANNIVERSAIRE - FR",
    "GIOVANA MALDONADO"
  ],

  en: [
    "HAPPY BIRTHDAY - EN",
    "GIOVANA MALDONADO"
  ],

  it: [
    "BUON COMPLEANNO - IT",
    "GIOVANA MALDONADO"
  ],

  pt: [
    "FELIZ ANIVERSÁRIO - PT",
    "GIOVANA MALDONADO"
  ],

  zh: [ // 🇨🇳 Chino simplificado
    "生日快乐- ZH",
    "GIOVANA MALDONADO"
  ],

  ja: [ // 🇯🇵 Japonés real
    "お誕生日おめでとう - JA",
    "GIOVANA MALDONADO"
  ],

  la: [ // 🏛️ Latín clásico
    "FELIX DIES NATALIS - LA",
    "GIOVANA MALDONADO"
  ]
};

const langColors = {
  es: 0xffd700, // dorado cálido (español)
  fr: 0xff69b4, // rosa elegante (francés)
  en: 0x87cefa, // azul cielo (inglés)
  it: 0x7fff00, // verde vibrante (italiano)
  pt: 0xffa500, // naranja alegre (portugués)
  zh: 0xff3333, // rojo tradicional chino
  ja: 0xff66cc, // rosa sakura japonés
  la: 0xffffff  // blanco clásico (latín)
};

let currentLang = "es";
let textCooldown = false;

const textParticles = []; 
const tulipGroups = [];
const sparkles = [];
const burstParticles = [];
const htmlButterflies = [];

/* ======================================================
   🎵 MÚSICA DE FONDO
====================================================== */

const bgMusic = new Audio("musica.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.35; // volumen suave (0.0 - 1.0)

/* ======================================================
   ESCENA BÁSICA THREE.JS
====================================================== */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050b1e);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.prepend(renderer.domElement);

renderer.domElement.style.position = 'fixed';
renderer.domElement.style.top = '0';
renderer.domElement.style.left = '0';
renderer.domElement.style.zIndex = '1';
renderer.domElement.style.pointerEvents = 'none';

scene.add(new THREE.AmbientLight(0xffffff, 1));
const textureLoader = new THREE.TextureLoader();

/* ======================================================
   FONDO ESTRELLADO
====================================================== */
const starCount = 800;
const starGeometry = new THREE.BufferGeometry();
const starPositions = [];
for (let i = 0; i < starCount; i++) {
  starPositions.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40, -20);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.12, transparent: true, opacity: 0.8 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

/* ======================================================
   CAMPO DE TULIPANES
====================================================== */
const tulipGroupTexture = textureLoader.load('tulip_group.png');
const tulipGroupMaterial = new THREE.SpriteMaterial({ map: tulipGroupTexture, transparent: true });

for (let i = 0; i < 10; i++) {
  const group = new THREE.Sprite(tulipGroupMaterial);
  const x = -9 + (i / 9) * 18;
  const y = -3 + Math.random() * 0.3;
  const scale = 7 + Math.random() * 0.7;
  group.position.set(x, y, -1);
  group.scale.set(scale, scale, 1);
  group.userData = { baseScale: scale, pulseOffset: Math.random() * Math.PI * 2 };
  scene.add(group);
  tulipGroups.push(group);
}

/* ======================================================
   LÓGICA DE MENSAJES Y CHISPAS
====================================================== */
const messages = [
  "Eres luz ✨",
  "Gracias por existir 🌷",
  "Este momento es tuyo 💫",
  "Nunca dejes de soñar 🦋",
  "Tu liderazgo inspira cada día 🌟",
  "Haces que todo fluya con calma y orden 🌿",
  "Tu trabajo deja huella 💼✨",
  "Guiar con el ejemplo es tu mayor fortaleza 🤍",
  "Tu dedicación mueve más que procesos 🚚💫",
  "Eres equilibrio entre mente y corazón ⚖️",
  "La logística también tiene alma… y la tuya brilla ✨",
  "Transformas retos en soluciones 🌈",
  "Gracias por hacer fácil lo complejo 🧩",
  "Tu visión construye caminos 🚀",
  "Eres inspiración silenciosa pero poderosa 🌸",
  "Liderar también es cuidar… y tú lo haces 💖",
  "Donde hay orden, hay tu esencia 🌟",
  "Tu constancia es un regalo para todos 🎁",
  "Hoy celebramos a alguien extraordinario 🌷",
  "Tu presencia hace la diferencia ✨"
];

const sparkleTexture = textureLoader.load('sparkle.png');
const sparkleMaterial = new THREE.SpriteMaterial({ map: sparkleTexture, transparent: true, opacity: 0.9 });

function spawnSparkle() {
  if (tulipGroups.length === 0) return;
  const origin = tulipGroups[Math.floor(Math.random() * tulipGroups.length)];
  const sparkle = new THREE.Sprite(sparkleMaterial);
  sparkle.position.set(origin.position.x + (Math.random() - 0.5) * 0.8, origin.position.y + Math.random() * 0.6, 0);
  sparkle.scale.set(0.2, 0.2, 1);
  scene.add(sparkle);
  sparkles.push({ sprite: sparkle, velocityY: Math.random() * 0.04 + 0.03, life: 0, explodeY: 0.5 + Math.random() * 2.5 });
}
setInterval(spawnSparkle, 800);

function explodeMessage(pos) {
  const vector = pos.clone().project(camera);
  const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-vector.y * 0.5 + 0.5) * window.innerHeight;
  const text = document.createElement('div');
  text.textContent = messages[Math.floor(Math.random() * messages.length)];
  text.style.cssText = `position:absolute;z-index:5;left:${x}px;top:${y}px;color:white;transform:translate(-50%,-50%);pointer-events:none;transition:all 2s;font-size:1.2rem;text-shadow: 0 0 10px rgba(255,255,255,0.5);`;
  document.body.appendChild(text);
  setTimeout(() => { text.style.opacity = '0'; text.style.transform = 'translate(-50%,-100%)'; }, 3000);
  setTimeout(() => text.remove(), 5500);
}

function createBurst(pos) {
  for (let i = 0; i < 10; i++) {
    const p = new THREE.Sprite(sparkleMaterial.clone());
    p.position.copy(pos);
    p.scale.set(0.15, 0.15, 1);
    const angle = (Math.PI * 2 * i) / 10;
    const speed = 0.06 + Math.random() * 0.05;
    scene.add(p);
    burstParticles.push({ sprite: p, velocity: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }, life: 1 });
  }
}

/* ======================================================
   🆕 TEXTO DE ESTRELLAS CON CAÍDA E IDIOMAS
====================================================== */
function createTextExplosion() {
  const langs = Object.keys(messagesByLang);
  currentLang = langs[Math.floor(Math.random() * langs.length)];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  
  // Mantenemos un canvas ancho pero con altura suficiente
  canvas.width = 1600; 
  canvas.height = 400;

  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // 1. Reducimos el tamaño de la fuente para que las letras sean más finas
  ctx.font = "bold 50px sans-serif";
  ctx.fillText(messagesByLang[currentLang][0], canvas.width / 2, 120);
  
  ctx.font = "bold 40px sans-serif";
  ctx.fillText(messagesByLang[currentLang][1], canvas.width / 2, 200);

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  
  // 2. Un step de 8 es el punto ideal entre entenderse y no saturar la PC
  const step = 3; 
  
  for (let y = 0; y < canvas.height; y += step) {
    for (let x = 0; x < canvas.width; x += step) {
      if (data[(y * canvas.width + x) * 4 + 3] > 128) {
        const color = langColors[currentLang] || 0xffffff;

        const p = new THREE.Sprite(
        new THREE.SpriteMaterial({ 
            color: color,
            transparent: true,
            opacity: 0 
        })
        );

        // 3. CAMBIO CLAVE: Cambiamos el divisor y la suma final
        // Divisor 60 hace el texto más compacto.
        // Sumar +2 en lugar de +4 baja el texto más hacia el centro.
        p.position.set(
        (x - canvas.width / 2) / 50, 
        (canvas.height / 2 - y) / 50 + 1, 
        3
        );

        // 4. Puntos muy pequeños para que se vea elegante
        p.scale.set(0.04, 0.04, 1);
        scene.add(p);

const angle = Math.random() * Math.PI * 2;
const speed = 0.08 + Math.random() * 0.12;

textParticles.push({
  sprite: p,
  velocityX: Math.cos(angle) * speed,
  velocityY: Math.sin(angle) * speed,
  life: 1.0,
  phase: 'form',
  timer: 0
});
      }
    }
  }
}

/* ======================================================
   MARIPOSAS HTML
====================================================== */
const butterflyTypes = [
  { src: 'Mariposa_1.gif', looksRight: true },
  { src: 'Mariposa_2.gif', looksRight: false },
  { src: 'Mariposa_3.gif', looksRight: false },
  { src: 'Mariposa_4.gif', looksRight: true }
];

butterflyTypes.forEach(type => {
  for (let i = 0; i < 2; i++) {
    const b = document.createElement('img');
    b.src = type.src;
    b.className = 'butterfly';
    const size = 110 + Math.random() * 40;
    b.style.width = `${size}px`;
    const direction = Math.random() < 0.5 ? 1 : -1;
    const flip = (direction === 1 && type.looksRight) || (direction === -1 && !type.looksRight) ? 1 : -1;
    
    b.dataset.x = direction === 1 ? -200 : window.innerWidth + 200;
    b.dataset.y = Math.random() * window.innerHeight * 0.7;
    b.dataset.direction = direction;
    b.dataset.flip = flip;
    b.dataset.speed = 1.5 + Math.random() * 2;
    b.dataset.wave = Math.random() * Math.PI * 2;

    b.onclick = () => { 
    // 🎵 Iniciar música solo una vez
    if (bgMusic.paused) {
    bgMusic.volume = 0;
    bgMusic.play().catch(() => {});

    let vol = 0;
    const fade = setInterval(() => {
        vol += 0.02;
        bgMusic.volume = Math.min(vol, 0.35);
        if (vol >= 0.35) clearInterval(fade);
    }, 200);
    }

    if (!textCooldown) { 
        textCooldown = true; 
        createTextExplosion(); 
        setTimeout(() => textCooldown = false, 5000); 
    }
    };
    document.body.appendChild(b);
    htmlButterflies.push(b);
  }
});

/* ======================================================
   BUCLE DE ANIMACIÓN
====================================================== */
function animate(time) {
  requestAnimationFrame(animate);

  // Efecto mágico en estrellas si hay texto
if (textParticles.length > 0) {
  const color = new THREE.Color(langColors[currentLang] || 0xffffff);
  starMaterial.color.lerp(color, 0.05);
  starMaterial.opacity = 0.9;
} else {
    starMaterial.color.setHex(0x88aaff);
    starMaterial.opacity = 0.6 + Math.sin(time * 0.0005) * 0.2;
  }

  tulipGroups.forEach((g, i) => {
    g.rotation.z = Math.sin(time * 0.001 + i) * 0.02;
    const pulse = 1 + Math.sin(time * 0.002 + g.userData.pulseOffset) * 0.02;
    g.scale.set(g.userData.baseScale * pulse, g.userData.baseScale * pulse, 1);
  });

  for (let i = sparkles.length - 1; i >= 0; i--) {
    const s = sparkles[i];
    s.sprite.position.y += s.velocityY;
    if (s.sprite.position.y > s.explodeY) {
      explodeMessage(s.sprite.position);
      createBurst(s.sprite.position);
      scene.remove(s.sprite); sparkles.splice(i, 1);
    }
  }

  for (let i = burstParticles.length - 1; i >= 0; i--) {
    const p = burstParticles[i];
    p.sprite.position.x += p.velocity.x; p.sprite.position.y += p.velocity.y;
    p.life -= 0.02; p.sprite.material.opacity = p.life;
    if (p.life <= 0) { scene.remove(p.sprite); burstParticles.splice(i, 1); }
  }

// 🆕 ANIMACIÓN TEXTO: Aparecer → Flotar → 💥 EXPLOTAR
for (let i = textParticles.length - 1; i >= 0; i--) {
  const p = textParticles[i];
  p.timer += 0.016;

  if (p.phase === 'form') {
    p.sprite.material.opacity += 0.05;
    if (p.sprite.material.opacity >= 1) {
      p.phase = 'float';
      p.timer = 0;
    }
  } 
  else if (p.phase === 'float') {
    // Pequeño temblor mágico
    p.sprite.position.y += Math.sin(time * 0.005) * 0.001;

    // ⏱️ después de 2 segundos → EXPLOTA
    if (p.timer > 4.0) {
      p.phase = 'explode';
    }
  } 
  else if (p.phase === 'explode') {
    // 💥 EXPLOSIÓN RADIAL
    p.sprite.position.x += p.velocityX;
    p.sprite.position.y += p.velocityY;

    // Fricción suave
    p.velocityX *= 0.98;
    p.velocityY *= 0.98;

    p.life -= 0.03;
    p.sprite.material.opacity = p.life;
  }

  if (p.life <= 0) {
    scene.remove(p.sprite);
    textParticles.splice(i, 1);
  }
}

  htmlButterflies.forEach(b => {
    let x = parseFloat(b.dataset.x) + parseFloat(b.dataset.direction) * parseFloat(b.dataset.speed);
    let wave = parseFloat(b.dataset.wave) + 0.03;
    let y = parseFloat(b.dataset.y) + Math.sin(wave) * 1.5;
    if (x > window.innerWidth + 250 || x < -250) x = parseFloat(b.dataset.direction) === 1 ? -250 : window.innerWidth + 250;
    b.style.transform = `translate3d(${x}px,${y}px,0) scaleX(${b.dataset.flip}) rotate(${Math.sin(wave)*10}deg)`;
    b.dataset.x = x; b.dataset.wave = wave;
  });

  renderer.render(scene, camera);
}

animate();

window.onresize = () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
};