// src/js/ember-particle.js
//------------------------------------------------------------
//  Setup
//------------------------------------------------------------
const forgeSection = document.querySelector('.forge-elements-section');

const canvas = document.createElement('canvas');
canvas.classList.add('ember-canvas');
forgeSection.appendChild(canvas);

const ctx = canvas.getContext('2d');

//------------------------------------------------------------
//  Canvas sizing (hi-DPI aware, but clamped)
//------------------------------------------------------------
const MAX_DPR = 1.5;                           // upper bound
let dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const w = forgeSection.offsetWidth;
  const h = forgeSection.offsetHeight;

  // Set CSS display size
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';

  canvas.width  = w * dpr;                     // physical pixels
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);      // draw in CSS pixels
  
  canvasWidth = w;
  canvasHeight = h;
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
const GRAVITY   = 0.001;   // Reduced from 0.002
const FADE_RATE = 0.002;   // Reduced from 0.003

class Particle {
  constructor(seedEverywhere = false) {
    this.reset(seedEverywhere);
  }

  reset(seedEverywhere = false) {
    this.x = Math.random() * canvasWidth;

    if (seedEverywhere) {
      // first batch: anywhere on screen
      this.y = Math.random() * canvasHeight;
    } else {
      // later: random band 40-80 px from the bottom
      const band = 40 + Math.random() * 40;
      this.y = canvasHeight - band;
    }

    this.size   = Math.random() * 2.5 + 1;
    this.speedX = (Math.random() - 0.5) * 0.4;      // Increased from 0.2 for more initial horizontal variety
    this.speedY = -(Math.random() * 0.8 + 1.2);     // Keep vertical speed the same
    this.opacity = 0.9 + Math.random() * 0.1;
  }

  update(deltaTime) {
    const progress = 1 - this.y / canvasHeight;
    this.speedX += (Math.random() - 0.5) * 0.06 * deltaTime;  // Increased from 0.03 for more drift variation
    this.x      += this.speedX * 1.8 * progress * deltaTime;  // Increased from 1.0 for more horizontal travel

    this.y      += this.speedY * deltaTime;
    this.speedY += GRAVITY * deltaTime;

    this.opacity -= FADE_RATE * deltaTime;

    if (this.opacity <= 0 || this.y < 0) {
      this.reset();
    }
  }

  // Simplified draw method - no longer sets canvas state
  draw() {
    if (this.opacity <= 0) return;

    ctx.globalAlpha = this.opacity;
    const half = this.size;
    ctx.drawImage(
      emberStamp,
      0, 0, STAMP_SIZE, STAMP_SIZE,            // source
      this.x - half, this.y - half,            // destination
      half * 2, half * 2
    );
  }
}

//------------------------------------------------------------
//  Particle pool and adaptive throttling
//------------------------------------------------------------
const particles = [];

// Mobile-aware particle counts
const isMobile = window.innerWidth < 768 || /Mobi|Android/i.test(navigator.userAgent);
const START_COUNT = isMobile ? 100 : 250;
const MIN_PARTICLES = isMobile ? 50 : 100;
const MAX_PARTICLES = isMobile ? 200 : 400;

for (let i = 0; i < START_COUNT; i++) {
  particles.push(new Particle(true));          // seed everywhere
}

//------------------------------------------------------------
//  Animation loop
//------------------------------------------------------------
let last = performance.now();
let lastParticleManagement = 0;

function animate() {
  const now = performance.now();
  const delta = now - last;
  last = now;

  const deltaTime = Math.min(delta / 16.67, 2.0);

  // Only manage particles ~60 times per second max
  if (now - lastParticleManagement > 16.67) {
    if (delta > 20 && particles.length > MIN_PARTICLES) {
      particles.length = Math.max(MIN_PARTICLES, particles.length - 10);
    } else if (delta < 12 && particles.length < MAX_PARTICLES) {
      for (let i = 0; i < 2; i++) particles.push(new Particle());
    }
    lastParticleManagement = now;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Update all particles first
  for (let i = 0; i < particles.length; i++) {
    particles[i].update(deltaTime);
  }

  // Then render all particles in batch with consistent state
  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < particles.length; i++) {
    particles[i].draw();
  }
  
  // Reset canvas state once at the end
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

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
      p.x = canvasWidth / 2;
      p.y = canvasHeight - 80;
      particles.push(p);
    }
  });
}