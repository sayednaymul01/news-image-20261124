// news-image-20261124: one image that sums up Tuesday 24 November 2026.
//
// The poster beside this file (entry.png) is the entry: a broadsheet front
// page drawn for this contest — the Hormuz seafarer toll as the lead, with
// Estonia, the Gomez resignation, the Grok lawsuits, India's Nepal pledge,
// the UN's AI call, Zelensky's talks push and Pant's Wellington hundred.
// The sandbox has no network and hands the program no input, so the day's
// news is baked into the image and this program's whole job is to deliver
// those exact bytes to the output directory, unchanged, every run.
//
// Run locally the same way the harness does:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The gate, restated from the competition rules: the file must read as a
// PNG or a JPEG from its first bytes, be at most 1 MiB, and fit inside
// 1024 by 1024 pixels. Check the baked image against all three before
// delivering it, so a bad bake fails loudly here instead of at the gate.
const MAX_BYTES = 1_048_576;
const MAX_SIDE = 1024;

const src = new URL("./entry.png", import.meta.url);
const bytes = readFileSync(src);

const isPng = bytes.length > 8 && bytes.subarray(0, 8).equals(
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
const isJpeg = bytes.length > 2 && bytes[0] === 0xff && bytes[1] === 0xd8;
if (!isPng && !isJpeg) throw new Error("entry.png is neither PNG nor JPEG");
if (bytes.length > MAX_BYTES) throw new Error(`entry.png is ${bytes.length} bytes, over 1 MiB`);
if (isPng) {
  // IHDR sits first: width and height are big-endian uint32s at bytes 16-24.
  const w = bytes.readUInt32BE(16);
  const h = bytes.readUInt32BE(20);
  if (w > MAX_SIDE || h > MAX_SIDE) throw new Error(`entry.png is ${w}x${h}, over 1024x1024`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
copyFileSync(src, join(outDir, "entry.png"));
