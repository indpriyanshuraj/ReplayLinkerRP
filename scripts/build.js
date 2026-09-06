#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

// ── Paths ──────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");
const CHANGELOG = path.join(ROOT, "CHANGELOG.md");
const MANIFEST = path.join(SRC, "manifest.json");

// ── Helpers ────────────────────────────────────────────────────────────────

function usage() {
  console.log("Usage: node scripts/build.js [--check] <version-or-tag>");
  console.log("");
  console.log("Options:");
  console.log("  --check   Validate only; do not produce a .mcpack archive.");
  console.log("");
  console.log("Examples:");
  console.log("  node scripts/build.js v1.0.0          Build and package v1.0.0");
  console.log("  node scripts/build.js --check v1.0.0  Validate v1.0.0 without packaging");
}

function fail(msg) {
  console.error("error: " + msg);
  process.exit(1);
}

// ── Minimal ZIP writer (STORE + DEFLATE, max compression) ──────────────────
// Produces a standard .zip archive. No external dependencies.

function crc32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
}

const CRC_TABLE = crc32Table();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeZip(entries) {
  // entries: [{ name, data }]
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf8");
    const data = entry.data;
    const crc = crc32(data);

    // Local file header (DEFLATE, compression level 9)
    const compressed = zlib.deflateRawSync(data, { level: 9 });

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // signature
    local.writeUInt16LE(20, 4);         // version needed
    local.writeUInt16LE(0, 6);         // flags
    local.writeUInt16LE(8, 8);         // compression: DEFLATE
    local.writeUInt16LE(0, 10);        // mod time
    local.writeUInt16LE(0, 12);        // mod date
    local.writeUInt32LE(crc, 14);      // crc32
    local.writeUInt32LE(compressed.length, 18); // compressed size
    local.writeUInt32LE(data.length, 22);       // uncompressed size
    local.writeUInt16LE(nameBuf.length, 26);    // filename length
    local.writeUInt16LE(0, 28);                 // extra field length

    localParts.push(local, nameBuf, compressed);

    // Central directory record
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0); // signature
    central.writeUInt16LE(20, 4);          // version made by
    central.writeUInt16LE(20, 6);          // version needed
    central.writeUInt16LE(0, 8);           // flags
    central.writeUInt16LE(8, 10);         // compression: DEFLATE
    central.writeUInt16LE(0, 12);         // mod time
    central.writeUInt16LE(0, 14);         // mod date
    central.writeUInt32LE(crc, 16);       // crc32
    central.writeUInt32LE(compressed.length, 20); // compressed size
    central.writeUInt32LE(data.length, 24);       // uncompressed size
    central.writeUInt16LE(nameBuf.length, 28);    // filename length
    central.writeUInt16LE(0, 30);                 // extra field length
    central.writeUInt16LE(0, 32);                  // comment length
    central.writeUInt16LE(0, 34);                  // disk number
    central.writeUInt16LE(0, 36);                  // internal attrs
    central.writeUInt32LE(0, 38);                  // external attrs
    central.writeUInt32LE(offset, 42);             // local header offset

    centralParts.push(central, nameBuf);

    offset += local.length + nameBuf.length + compressed.length;
  }

  const localBuf = Buffer.concat(localParts);
  const centralBuf = Buffer.concat(centralParts);

  // End of central directory record
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);     // signature
  eocd.writeUInt16LE(0, 4);              // disk number
  eocd.writeUInt16LE(0, 6);              // disk with central dir
  eocd.writeUInt16LE(entries.length, 8);  // entries on this disk
  eocd.writeUInt16LE(entries.length, 10); // total entries
  eocd.writeUInt32LE(centralBuf.length, 12); // central dir size
  eocd.writeUInt32LE(localBuf.length, 16);    // central dir offset
  eocd.writeUInt16LE(0, 20);                  // comment length

  return Buffer.concat([localBuf, centralBuf, eocd]);
}

// ── Walk directory recursively ─────────────────────────────────────────────

function walkDir(dir, base) {
  const result = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    const rel = base ? base + "/" + entry.name : entry.name;
    if (entry.isDirectory()) {
      result.push(...walkDir(full, rel));
    } else {
      result.push({ full, rel });
    }
  }
  return result;
}

// ── Read all files from src/ into a list of {name, data} ───────────────────

function readSrcFiles() {
  const files = walkDir(SRC);
  return files.map(({ full, rel }) => ({
    name: rel,
    data: fs.readFileSync(full),
  }));
}

// ── Minify a JSON buffer ──────────────────────────────────────────────────

function minifyJson(data) {
  const json = JSON.parse(data.toString("utf8"));
  return Buffer.from(JSON.stringify(json), "utf8");
}

// ── Extract changelog section for a version ────────────────────────────────

function extractChangelog(version) {
  const text = fs.readFileSync(CHANGELOG, "utf8");
  const lines = text.split("\n");

  const heading = `## [${version}]`;
  const headingWithDate = `## [${version}] -`;
  let inSection = false;
  let found = false;
  const out = [];

  for (const line of lines) {
    if (line === heading || line.startsWith(headingWithDate)) {
      inSection = true;
      found = true;
      continue;
    }
    if (inSection) {
      // Stop at next version heading
      if (/^## \[/.test(line) && !line.startsWith(headingWithDate) && line !== heading) {
        break;
      }
      // Skip reference-style links
      if (/^\[[^\]]+\]: /.test(line)) continue;
      out.push(line);
    }
  }

  if (!found) {
    fail(`CHANGELOG.md has no entry for [${version}]`);
  }

  // Trim trailing empty lines
  while (out.length > 0 && out[out.length - 1].trim() === "") {
    out.pop();
  }

  if (out.length === 0) {
    fail("generated release notes are empty");
  }

  return out.join("\n") + "\n";
}

// ── Main ──────────────────────────────────────────────────────────────────

function main() {
  const args = process.argv.slice(2);

  let checkOnly = false;
  if (args[0] === "--check") {
    checkOnly = true;
    args.shift();
  }

  if (args.length !== 1) {
    usage();
    process.exit(2);
  }

  const tag = args[0];
  const version = tag.startsWith("v") ? tag.slice(1) : tag;

  // SemVer 2.0.0 validation
  const semverRe = /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?$/;
  if (!semverRe.test(version)) {
    fail(`invalid SemVer tag: ${tag}`);
  }

  // Check paths exist
  if (!fs.existsSync(SRC)) fail(`missing src/: ${SRC}`);
  if (!fs.existsSync(MANIFEST)) fail("missing src/manifest.json");
  if (!fs.existsSync(CHANGELOG)) fail("missing CHANGELOG.md");

  // Read and parse manifest
  const manifestData = fs.readFileSync(MANIFEST, "utf8");
  let manifest;
  try {
    manifest = JSON.parse(manifestData);
  } catch (e) {
    fail(`src/manifest.json is not valid JSON: ${e.message}`);
  }

  const manifestVersion = Array.isArray(manifest.header.version)
    ? manifest.header.version.join(".")
    : String(manifest.header.version);

  if (manifestVersion !== version) {
    fail(`src/manifest.json header.version is ${manifestVersion}, expected ${version}`);
  }

  // Validate all JSON files in src/
  const srcFiles = readSrcFiles();
  const jsonFiles = srcFiles.filter((f) => f.name.endsWith(".json"));
  let jsonError = false;
  for (const f of jsonFiles) {
    try {
      JSON.parse(f.data.toString("utf8"));
    } catch (e) {
      console.error(`error: invalid JSON: ${f.name}`);
      jsonError = true;
    }
  }
  if (jsonError) {
    process.exit(1);
  }

  // Validate changelog has entry
  try {
    extractChangelog(version);
  } catch (e) {
    if (e.message && e.message.startsWith("CHANGELOG.md has no entry")) {
      fail(e.message);
    }
    throw e;
  }

  if (checkOnly) {
    console.log("Check mode: validating without packaging.");
    console.log(`All checks passed for v${version}.`);
    return;
  }

  // ── Full build ──────────────────────────────────────────────────────

  // Clean dist
  if (fs.existsSync(DIST)) {
    fs.rmSync(DIST, { recursive: true });
  }
  fs.mkdirSync(DIST, { recursive: true });

  // Build file list with minified JSON and synced extension pack version
  const entries = srcFiles.map((f) => {
    let data = f.data;

    // Minify JSON
    if (f.name.endsWith(".json")) {
      data = minifyJson(data);
    }

    // Sync $pack_version in extension_packs.json
    if (f.name === "ui/déesse_ui/déesse_screen/extension_packs.json") {
      const json = JSON.parse(data.toString("utf8"));
      const mods = json.extension_packs_list?.modifications;
      if (Array.isArray(mods)) {
        for (const mod of mods) {
          if (mod.value && typeof mod.value === "object") {
            for (const key of Object.keys(mod.value)) {
              const item = mod.value[key];
              if (item && typeof item === "object" && "$pack_version" in item) {
                item.$pack_version = version;
              }
            }
          }
        }
      }
      data = Buffer.from(JSON.stringify(json), "utf8");
    }

    return { name: f.name, data };
  });

  // Create .mcpack (zip)
  const zipBuf = writeZip(entries);
  const outputPath = path.join(DIST, `ReplayLinkerRP-${tag}.mcpack`);
  fs.writeFileSync(outputPath, zipBuf);

  // Extract release notes
  const notes = extractChangelog(version);
  const notesPath = path.join(DIST, "RELEASE_NOTES.md");
  fs.writeFileSync(notesPath, notes);

  console.log(`Built: ${outputPath}`);
  console.log(`Size: ${fs.statSync(outputPath).size} bytes`);
  console.log(`Release notes: ${notesPath}`);
}

main();
