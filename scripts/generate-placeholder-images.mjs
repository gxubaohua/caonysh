// One-shot generator for tiny solid-color placeholder PNGs committed to
// src/assets/ and referenced by src/content/products.json.
// Usage: node scripts/generate-placeholder-images.mjs
// PNG: 8x8 RGBA, no compression tricks needed — raw zlib of the pixel rows.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const assetsDir = resolve(scriptDir, '../src/assets');
mkdirSync(assetsDir, { recursive: true });

function crc32(buf) {
  let table = crc32.table;
  if (!table) {
    table = crc32.table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  let crc = -1;
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ -1) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function png8x8(rgba) {
  // IHDR: width 8, height 8, bit depth 8, color type 6 (RGBA)
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(8, 0);
  ihdr.writeUInt32BE(8, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  // IDAT: each row prefixed with filter byte 0
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(rgba)]);
  const raw = Buffer.concat(Array(8).fill(row));
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

const placeholders = [
  { file: 'steel-ball-bearing.png', color: [90, 110, 140, 255] },
  { file: 'stainless-steel-hex-nut.png', color: [170, 174, 182, 255] },
  { file: 'nylon-spacer.png', color: [222, 226, 230, 255] },
  { file: 'nitrile-rubber-gasket.png', color: [200, 160, 130, 255] },
];

for (const { file, color } of placeholders) {
  const [r, g, b, a] = color;
  const pixel = Buffer.from([r, g, b, a]);
  const pixels = Buffer.concat(Array(8).fill(pixel));
  writeFileSync(resolve(assetsDir, file), png8x8(pixels));
  console.log(`wrote src/assets/${file}`);
}
