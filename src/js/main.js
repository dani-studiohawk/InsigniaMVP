// main.js - Main entry point for the website
// Functionality has been separated into individual modules:
// - navigation.js: Navigation and mobile menu
// - gallery.js: Gallery functionality and modals
// - faq.js: FAQ carousel
// - character-gallery.js: Character gallery
// - logo-effects.js: Logo animations and effects

// All modules are loaded separately and initialize on DOMContentLoaded
// main.js
async function measureTear(url, alpha = 128, sample = 1) {
  const img = new Image();
  img.src = url;                   // path is relative to the HTML page
  await img.decode();

  const w = img.naturalWidth, h = img.naturalHeight;
  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0);

  const data = ctx.getImageData(0, 0, w, h).data;
  const edge = [];

  // For each column, find the first opaque pixel from the top
  for (let x = 0; x < w; x += sample) {
    let y = h; // default if transparent
    for (let yy = 0; yy < h; yy++) {
      const i = 4 * (yy * w + x);
      if (data[i + 3] >= alpha) { y = yy; break; }
    }
    edge.push(y);
  }

  // Median seam and extremes
  const sorted = [...edge].sort((a, b) => a - b);
  const min = sorted[0];
  const max = sorted[sorted.length - 1];
  const median = sorted[Math.floor(sorted.length * 0.5)];

  const up = median - min;     // spikes above seam
  const down = max - median;   // spikes below seam

  return { h, up, down };
}

document.addEventListener('DOMContentLoaded', async () => {
  const section = document.querySelector('.faq-carousel-section');
  if (!section) return;

  // Use the correct path for YOUR page. This is relative to the HTML file.
  const tearPath = 'src/assets/images/tear.svg';

  // 1) Read the SVG edge
  const m = await measureTear(tearPath);

  // 2) Pick the rendered tear height you use in CSS
  const tearH = parseFloat(getComputedStyle(section).getPropertyValue('--tear-h')) || 100;

  // 3) Convert to pixels at the rendered height
  const tearUpPx = (m.up / m.h) * tearH;
  const tearDownPx = (m.down / m.h) * tearH;

  // 4) Store as CSS variables on this section
  section.style.setProperty('--tear-up', `${tearUpPx.toFixed(2)}px`);
  section.style.setProperty('--tear-down', `${tearDownPx.toFixed(2)}px`);

  // 5) Optional breathing room
  section.style.setProperty('--tear-gap', '16px');

  // Debug in the console so you can see the numbers
  console.log('tear metrics:', {
    svgHeight: m.h,
    upSvg: m.up, downSvg: m.down,
    tearH, tearUpPx, tearDownPx
  });
});
