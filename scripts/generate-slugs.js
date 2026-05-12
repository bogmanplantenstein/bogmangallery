'use strict';
// ─────────────────────────────────────────────────────────────────────────────
// scripts/generate-slugs.js
// Utility: generate/backfill slug fields on all taxa in data.json.
// Safe to re-run — never overwrites an existing slug.
// Usage: node scripts/generate-slugs.js
// ─────────────────────────────────────────────────────────────────────────────

const fs   = require('fs');
const path = require('path');
const DATA = path.join(__dirname, '..', 'data', 'data.json');

function toSlug(name) {
  return (name || '')
    .toLowerCase()
    .replace(/['"\(\),\.]+/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const seen = {};
let generated = 0, skipped = 0, conflicts = 0;

for (const t of data.taxa) {
  if (t.slug) { skipped++; seen[t.slug] = (seen[t.slug] || 0) + 1; continue; }

  let slug = toSlug(t.displayName);
  if (seen[slug]) {
    conflicts++;
    let n = 2;
    while (seen[slug + '-' + n]) n++;
    console.warn('⚠ Conflict resolved:', slug, '→', slug + '-' + n, '(', t.id, ')');
    slug = slug + '-' + n;
  }
  seen[slug] = (seen[slug] || 0) + 1;
  t.slug = slug;
  generated++;
}

fs.writeFileSync(DATA, JSON.stringify(data, null, 2));
console.log('Done.');
console.log('  Total taxa:  ', data.taxa.length);
console.log('  Slugs generated:', generated);
console.log('  Already had slug:', skipped);
console.log('  Conflicts resolved:', conflicts);
