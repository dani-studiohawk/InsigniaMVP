// src/js/ember-particle.js
//------------------------------------------------------------
//  Setup
//------------------------------------------------------------
const storySection = document.querySelector('.story-section');

const canvas = document.createElement('canvas');
canvas.classList.add('ember-canvas');
storySection.appendChild(canvas);

const ctx = canvas.getContext('2d');

//------------------------------------------------------------
//  Canvas sizing (hi-DPI aware, but clamped)
//------------------------------------------------------------
const MAX_DPR = 1.5;                           // upper bound
let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

function resizeCanvas() {
  const w = storySection.offsetWidth;
  const h = storySection.offsetHeight;

  canvas.width  = w * dpr;                     // physical pixels
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);      // draw in CSS pixels
}

let resizeTimer = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    resizeCanvas();
  }, 200);
});
resizeCanvas();

//------------------------------------------------------------
//  Pre-rendered ember sprite (32 × 32 radial gradient)
//------------------------------------------------------------
const STAMP_SIZE = 32;
const emberStamp = document.createElement('canvas');
emberStamp.width = emberStamp.height = STAMP_SIZE;

const sctx = emberStamp.getContext('2d');
const grad = sctx.createRadialGradient(
  STAMP_SIZE / 2,
  STAMP_SIZE / 2,
  0,
  STAMP_SIZE / 2,
  STAMP_SIZE / 2,
  STAMP_SIZE / 2
);
grad.addColorStop(0, 'hsl(30,100%,60%)');
grad.addColorStop(1, 'transparent');
sctx.fillStyle = grad;
sctx.fillRect(0, 0, STAMP_SIZE, STAMP_SIZE);

//------------------------------------------------------------
//  Particle class
//------------------------------------------------------------
const GRAVITY   = 0.002;
const FADE_RATE = 0.003;

class Particle {
  constructor(seedEverywhere = false) {
    this.reset(seedEverywhere);
  }

  reset(seedEverywhere = false) {
    this.x = Math.random() * storySection.offsetWidth;

    if (seedEverywhere) {
      // first batch: anywhere on screen
      this.y = Math.random() * storySection.offsetHeight;
    } else {
      // later: random band 40-80 px from the bottom
      const band = 40 + Math.random() * 40;
      this.y = storySection.offsetHeight - band;
    }

    this.size   = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -(Math.random() * 1.2 + 1.8);
    this.opacity = 0.9 + Math.random() * 0.1;
  }

  update() {
    const progress = 1 - this.y / storySection.offsetHeight;
    this.speedX += (Math.random() - 0.5) * 0.05;
    this.x      += this.speedX * 1.5 * progress;

    this.y      += this.speedY;
    this.speedY += GRAVITY;

    this.opacity -= FADE_RATE;

    if (this.opacity <= 0 || this.y < 0) {
      this.reset();
    }
  }

  draw() {
    if (this.opacity <= 0) return;

    ctx.globalAlpha = this.opacity;
    ctx.globalCompositeOperation = 'lighter';

    const half = this.size;
    ctx.drawImage(
      emberStamp,
      0, 0, STAMP_SIZE, STAMP_SIZE,            // source
      this.x - half, this.y - half,            // destination
      half * 2, half * 2
    );

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
}

//------------------------------------------------------------
//  Particle pool and adaptive throttling
//------------------------------------------------------------
const particles     = [];
const START_COUNT   = 300;
const MIN_PARTICLES = 100;
const MAX_PARTICLES = 400;

for (let i = 0; i < START_COUNT; i++) {
  particles.push(new Particle(true));          // seed everywhere
}

//------------------------------------------------------------
//  Animation loop
//------------------------------------------------------------
let last = performance.now();

function animate() {
  const now   = performance.now();
  const delta = now - last;
  last = now;

  // adapt particle count to frame time
  if (delta > 20 && particles.length > MIN_PARTICLES) {
    particles.length = Math.max(MIN_PARTICLES, particles.length - 10);
  } else if (delta < 12 && particles.length < MAX_PARTICLES) {
    for (let i = 0; i < 2; i++) particles.push(new Particle());
  }

  ctx.clearRect(0, 0, storySection.offsetWidth, storySection.offsetHeight);

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  requestAnimationFrame(animate);
}
animate();

//------------------------------------------------------------
//  Optional hammer burst
//------------------------------------------------------------
const hammer = document.querySelector('.hammer-image');
if (hammer) {
  hammer.addEventListener('click', () => {
    for (let i = 0; i < 30; i++) {
      const p = new Particle();
      p.x = storySection.offsetWidth / 2;
      p.y = storySection.offsetHeight - 80;
      particles.push(p);
    }
  });
}
