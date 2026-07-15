import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const publicDir = path.resolve(import.meta.dirname, "..", "public");

const GLYPH = "M6 20 L6 12 L10 12 L10 20 M22 20 L22 12 L26 12 L26 20 M10 16 L22 16";

function svgFor({ rounded, glyphScale = 1 }) {
  const r = rounded ? 7 : 0;
  const cx = 16;
  const cy = 16;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
    <rect width="32" height="32" rx="${r}" fill="#0b0b0d"/>
    <g transform="translate(${cx} ${cy}) scale(${glyphScale}) translate(${-cx} ${-cy})">
      <path d="${GLYPH}" stroke="#d7ff3f" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    </g>
  </svg>`;
}

async function renderPng(svg, size, filename) {
  const buffer = await sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();
  await writeFile(path.join(publicDir, filename), buffer);
  console.log(`wrote ${filename} (${size}x${size}, ${buffer.length} bytes)`);
}

await mkdir(publicDir, { recursive: true });

// iOS home-screen icon: square, no baked-in corner rounding (iOS applies its own mask).
await renderPng(svgFor({ rounded: false }), 180, "apple-touch-icon.png");

// PWA manifest icons.
await renderPng(svgFor({ rounded: true }), 192, "icon-192.png");
await renderPng(svgFor({ rounded: true }), 512, "icon-512.png");

// Maskable variant: extra padding so Android's adaptive-icon crop never clips the glyph.
await renderPng(svgFor({ rounded: false, glyphScale: 0.6 }), 512, "icon-512-maskable.png");

console.log("Done.");
