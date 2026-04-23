// ═══════════════════════════════════════════════════════════════
// BOGMAN PLANT GALLERY — gallery.js  v2
// Squarespace Code Block — set once, never edit again.
// Data: raw.githubusercontent.com (auto-detected from jsDelivr src)
// Hosting: https://cdn.jsdelivr.net/gh/bogmanplantenstein/bogmangallery@main/gallery.js
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── CONFIG ───────────────────────────────────────────────────
  // Data URL is auto-derived from this script's jsDelivr src URL.
  // Only set DATA_URL_OVERRIDE if auto-detection fails.
  const DATA_URL_OVERRIDE = '';

  function resolveDataUrl() {
    if (DATA_URL_OVERRIDE) return DATA_URL_OVERRIDE;
    try {
      const candidates = Array.from(document.querySelectorAll('script[src]'));
      if (document.currentScript) candidates.unshift(document.currentScript);
      for (const s of candidates) {
        const m = (s.src || '').match(/cdn\.jsdelivr\.net\/gh\/([^@/]+\/[^@/]+)@([^/]+)/);
        if (m) return 'https://raw.githubusercontent.com/' + m[1] + '/' + m[2] + '/data/data.json';
      }
    } catch (e) {}
    // Hard fallback — update YOUR_GITHUB_USER if auto-detection fails
    return 'https://raw.githubusercontent.com/bogmanplantenstein/bogmangallery/main/data/data.json';
  }

  const CONFIG = {
    DATA_URL:  resolveDataUrl(),
    CACHE_KEY: 'bmg_data_cache_v2',
    CACHE_TTL: 60 * 60 * 1000,   // 1 hour
  };

  // ─── CSS ──────────────────────────────────────────────────────
  const CSS = `
:root {
  --bmg-black:       #000000;
  --bmg-white:       #ffffff;
  --bmg-off-white:   #f0ede8;
  --bmg-dim:         #999999;
  --bmg-dimmer:      #555555;
  --bmg-border:      rgba(255,255,255,0.1);
  --bmg-border-hi:   rgba(255,255,255,0.25);
  --bmg-accent:      #c8a96e;
  --bmg-accent-dim:  rgba(200,169,110,0.15);
  --bmg-font-d:      'Cormorant Garamond', Georgia, serif;
  --bmg-font-u:      'Josefin Sans', sans-serif;
  --bmg-r:           2px;
  --bmg-t:           0.2s ease;
}

/* ── Reset inside root ── */
#bmg-root *,
#bmg-root *::before,
#bmg-root *::after { box-sizing: border-box; margin: 0; padding: 0; }

#bmg-root {
  background: var(--bmg-black);
  color: var(--bmg-white);
  font-family: var(--bmg-font-u);
  font-weight: 300;
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}

/* ── LOADING ── */
.bmg-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 20px;
  color: var(--bmg-dimmer);
}
.bmg-spinner {
  width: 24px; height: 24px;
  border: 1px solid var(--bmg-dimmer);
  border-top-color: var(--bmg-accent);
  border-radius: 50%;
  animation: bmg-spin 0.9s linear infinite;
}
.bmg-loading-text {
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}
@keyframes bmg-spin { to { transform: rotate(360deg); } }

/* ── ERROR ── */
.bmg-error {
  padding: 60px 40px;
  text-align: center;
  color: var(--bmg-dimmer);
}
.bmg-error h3 {
  font-family: var(--bmg-font-d);
  font-size: 22px;
  font-weight: 300;
  color: var(--bmg-white);
  margin-bottom: 12px;
}
.bmg-error p { font-size: 13px; line-height: 1.7; }
.bmg-error code { font-size: 12px; color: var(--bmg-accent); }

/* ── PAGE HEADER ── */
.bmg-header {
  padding: 52px 64px 40px;
  border-bottom: 1px solid var(--bmg-border);
}
.bmg-header-eyebrow {
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--bmg-dim);
  margin-bottom: 12px;
}
.bmg-header-title {
  font-family: var(--bmg-font-d);
  font-size: clamp(44px, 5.5vw, 72px);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1;
  color: var(--bmg-white);
  margin-bottom: 10px;
}
.bmg-header-sub {
  font-size: 13px;
  font-weight: 400;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bmg-off-white);
  opacity: 0.6;
}
.bmg-header-desc {
  font-size: 14px;
  line-height: 1.7;
  color: var(--bmg-dim);
  max-width: 640px;
  margin-top: 20px;
  letter-spacing: 0;
  text-transform: none;
  opacity: 1;
}

/* ── SEARCH + FILTERS ── */
.bmg-controls {
  padding: 24px 64px;
  border-bottom: 1px solid var(--bmg-border);
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: rgba(255,255,255,0.02);
}
.bmg-search-row {
  display: flex;
  align-items: center;
  gap: 16px;
}
.bmg-search-wrap {
  position: relative;
  flex: 1;
}
.bmg-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--bmg-dimmer);
  font-size: 18px;
  pointer-events: none;
  line-height: 1;
  width: 24px;
  text-align: center;
}
.bmg-search {
  width: 100%;
  padding: 20px 18px 20px 56px;
  background: transparent;
  border: 1px solid var(--bmg-border);
  color: var(--bmg-white);
  font-family: var(--bmg-font-u);
  font-size: 15px;
  font-weight: 300;
  letter-spacing: 0.04em;
  outline: none;
  transition: border-color var(--bmg-t), background var(--bmg-t);
}
.bmg-search::placeholder { color: var(--bmg-dimmer); }
.bmg-search:focus { border-color: var(--bmg-border-hi); background: rgba(255,255,255,0.03); }

.bmg-filter-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
}
.bmg-filter-label {
  font-size: 13px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  white-space: nowrap;
  margin-right: 2px;
  flex-shrink: 0;
}
.bmg-filter-select {
  background: transparent;
  border: 1px solid var(--bmg-border);
  color: var(--bmg-white);
  font-family: var(--bmg-font-u);
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 0.03em;
  padding: 20px 36px 20px 16px;
  outline: none;
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23555'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  transition: border-color var(--bmg-t);
  flex: 1;
  min-width: 156px;
}
.bmg-filter-select:focus { border-color: var(--bmg-border-hi); }
.bmg-filter-select option { background: #111; color: var(--bmg-white); }

.bmg-results-count {
  font-size: 14px;
  letter-spacing: 0.12em;
  color: var(--bmg-dimmer);
  text-transform: uppercase;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ── BREADCRUMB ── */
.bmg-breadcrumb {
  padding: 12px 64px;
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid var(--bmg-border);
  min-height: 42px;
}
.bmg-bc-item {
  cursor: pointer;
  transition: color var(--bmg-t);
}
.bmg-bc-item:hover { color: var(--bmg-white); }
.bmg-bc-item.active { color: var(--bmg-white); cursor: default; }
.bmg-bc-sep { color: var(--bmg-dimmer); opacity: 0.4; }

/* ── MAIN CONTENT ── */
.bmg-main { padding: 40px 64px; }

/* ── GENUS GRID ── */
.bmg-genus-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1px;
  background: var(--bmg-border);
  border: 1px solid var(--bmg-border);
}
.bmg-genus-card {
  background: var(--bmg-black);
  padding: 0;
  cursor: pointer;
  transition: background var(--bmg-t);
  position: relative;
  overflow: hidden;
  min-height: 220px;
}
.bmg-genus-photo-wrap {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.bmg-genus-photo-slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.bmg-genus-photo-slide.active { opacity: 1; }
.bmg-genus-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.15) 0%,
    rgba(0,0,0,0.55) 60%,
    rgba(0,0,0,0.82) 100%
  );
}
.bmg-genus-card-content {
  position: relative;
  z-index: 1;
  padding: 36px 32px;
}
.bmg-genus-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 32px; right: 32px;
  height: 1px;
  background: var(--bmg-accent);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
  z-index: 2;
}
.bmg-genus-card:hover .bmg-genus-overlay {
  background: linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 60%, rgba(0,0,0,0.88) 100%);
}
.bmg-genus-card:hover::after { transform: scaleX(1); }
.bmg-genus-name {
  font-family: var(--bmg-font-d);
  font-style: italic;
  font-size: 32px;
  font-weight: 300;
  color: var(--bmg-white);
  margin-bottom: 6px;
  line-height: 1.1;
}
.bmg-genus-common {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  margin-bottom: 24px;
}
.bmg-genus-stats {
  display: flex;
  gap: 24px;
}
.bmg-genus-stat-val {
  font-family: var(--bmg-font-d);
  font-size: 28px;
  font-weight: 300;
  color: var(--bmg-accent);
  line-height: 1;
  display: block;
}
.bmg-genus-stat-label {
  font-size: 12px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  display: block;
  margin-top: 3px;
}
.bmg-genus-arrow {
  position: absolute;
  top: 36px; right: 32px;
  font-size: 18px;
  color: var(--bmg-dimmer);
  transition: all var(--bmg-t);
}
.bmg-genus-card:hover .bmg-genus-arrow {
  color: var(--bmg-accent);
  transform: translateX(4px);
}

/* ── SPECIES GRID ── */
.bmg-species-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 12px;
}
.bmg-species-title {
  font-family: var(--bmg-font-d);
  font-style: italic;
  font-size: 36px;
  font-weight: 300;
  color: var(--bmg-white);
}
.bmg-back-btn {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  font-family: var(--bmg-font-u);
  transition: color var(--bmg-t);
  display: flex;
  align-items: center;
  gap: 8px;
}
.bmg-back-btn:hover { color: var(--bmg-white); }

.bmg-group-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--bmg-border);
  margin-bottom: 28px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
}
.bmg-group-tabs::-webkit-scrollbar { display: none; }
.bmg-group-tab {
  padding: 10px 20px;
  font-size: 10px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.15s, border-color 0.15s;
  background: none;
  border-top: none;
  border-left: none;
  border-right: none;
  font-family: var(--bmg-font-u);
}
.bmg-group-tab:hover { color: var(--bmg-white); }
.bmg-group-tab.active {
  color: var(--bmg-accent);
  border-bottom-color: var(--bmg-accent);
}
.bmg-group-tab-count {
  margin-left: 6px;
  font-size: 9px;
  color: var(--bmg-dimmer);
  font-style: normal;
}
.bmg-species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.bmg-species-card {
  cursor: pointer;
  position: relative;
}
.bmg-species-photo-wrap {
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #0a0a0a;
  border: 1px solid var(--bmg-border);
  margin-bottom: 10px;
  position: relative;
}
.bmg-species-photo {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  transition: transform 0.4s ease;
  filter: brightness(0.9);
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}
.bmg-species-card:hover .bmg-species-photo {
  transform: scale(1.05);
  filter: brightness(1);
}
.bmg-species-no-photo {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--bmg-dimmer);
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}
.bmg-species-tag {
  position: absolute;
  top: 8px; right: 8px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 3px 7px;
  background: rgba(0,0,0,0.75);
  color: var(--bmg-accent);
  backdrop-filter: blur(4px);
}
.bmg-species-name {
  font-family: var(--bmg-font-d);
  font-style: italic;
  font-size: 15px;
  font-weight: 400;
  color: var(--bmg-white);
  line-height: 1.3;
  margin-bottom: 3px;
}
.bmg-species-sub {
  font-size: 12px;
  letter-spacing: 0.1em;
  color: var(--bmg-dimmer);
  text-transform: uppercase;
}

/* ── DETAIL VIEW ── */
.bmg-detail { max-width: 1000px; }
.bmg-detail-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  margin-bottom: 48px;
  align-items: start;
}
.bmg-lightbox-trigger {
  position: relative;
  cursor: pointer;
  background: #0a0a0a;
  border: 1px solid var(--bmg-border);
  overflow: hidden;
  aspect-ratio: 4/3;
}
.bmg-lightbox-trigger img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  filter: brightness(0.9);
  transition: filter 0.3s ease, opacity 0.18s ease;
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}
.bmg-lightbox-trigger img.bmg-photo-swapping {
  opacity: 0;
}
.bmg-lightbox-trigger:hover img { filter: brightness(1); }
.bmg-photo-count {
  position: absolute;
  bottom: 10px; right: 10px;
  font-size: 10px;
  letter-spacing: 0.1em;
  background: rgba(0,0,0,0.8);
  color: var(--bmg-dim);
  padding: 4px 9px;
  backdrop-filter: blur(4px);
}
.bmg-photo-thumbs {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.bmg-thumb {
  width: 52px;
  height: 39px;
  object-fit: cover;
  cursor: pointer;
  border: 1px solid transparent;
  filter: brightness(0.7);
  transition: all var(--bmg-t);
  pointer-events: auto;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}
.bmg-thumb:hover, .bmg-thumb.active {
  border-color: var(--bmg-accent);
  filter: brightness(1);
}

/* Detail meta */
.bmg-detail-genus-label {
  font-size: 12px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  margin-bottom: 10px;
}
.bmg-detail-name {
  font-family: var(--bmg-font-d);
  font-style: italic;
  font-size: clamp(26px, 4vw, 40px);
  font-weight: 300;
  color: var(--bmg-white);
  line-height: 1.1;
  margin-bottom: 6px;
  letter-spacing: -0.01em;
}
.bmg-divider {
  height: 1px;
  background: var(--bmg-border);
  margin: 20px 0;
}
.bmg-field-label {
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  margin-bottom: 5px;
}
.bmg-field-value {
  font-size: 13px;
  color: var(--bmg-off-white);
  line-height: 1.65;
  font-weight: 300;
  margin-bottom: 18px;
}
.bmg-field-value a {
  color: var(--bmg-accent);
  text-decoration: none;
}
.bmg-field-value a:hover { text-decoration: underline; }

/* Care grid */
.bmg-care-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1px;
  background: var(--bmg-border);
  border: 1px solid var(--bmg-border);
  margin-bottom: 18px;
}
.bmg-care-item {
  background: var(--bmg-black);
  padding: 12px 14px;
}
.bmg-care-key {
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  margin-bottom: 4px;
}
.bmg-care-val {
  font-size: 12px;
  color: var(--bmg-off-white);
  line-height: 1.5;
  font-weight: 300;
}

/* Shop buttons */
.bmg-shop-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 18px;
}
.bmg-shop-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--bmg-font-u);
  font-size: 10px;
  font-weight: 300;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--bmg-black);
  background: var(--bmg-white);
  padding: 9px 16px;
  border: 1px solid var(--bmg-white);
  transition: all var(--bmg-t);
  cursor: pointer;
}
.bmg-shop-btn:hover {
  background: transparent;
  color: var(--bmg-white);
}
.bmg-shop-btn.secondary {
  background: transparent;
  color: var(--bmg-white);
  border-color: var(--bmg-border-hi);
}
.bmg-shop-btn.secondary:hover { border-color: var(--bmg-white); }

/* ── FORMS / CULTIVARS SECTION ── */
.bmg-cultivars-section {
  margin-top: 48px;
  padding-top: 40px;
  border-top: 1px solid var(--bmg-border);
}
.bmg-section-title {
  font-size: 12px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}
.bmg-section-title::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--bmg-border);
  max-width: 120px;
}
.bmg-cultivars-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 14px;
}

/* ── EXTERNAL LINKS ── */
.bmg-ext-section {
  margin-top: 40px;
  padding-top: 32px;
  border-top: 1px solid var(--bmg-border);
}
.bmg-ext-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
.bmg-ext-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--bmg-dim);
  border: 1px solid var(--bmg-border);
  padding: 7px 14px;
  transition: all var(--bmg-t);
}
.bmg-ext-link:hover {
  color: var(--bmg-white);
  border-color: var(--bmg-border-hi);
}
.bmg-ext-link-arrow { opacity: 0.5; font-size: 12px; }

/* ── HYBRIDS VIEW ── */
.bmg-hybrids-search {
  margin-bottom: 24px;
  max-width: 300px;
}
.bmg-hybrids-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}
.bmg-hybrid-card {
  border: 1px solid var(--bmg-border);
  overflow: hidden;
  background: #0a0a0a;
}
.bmg-hybrid-photo {
  aspect-ratio: 1/1;
  overflow: hidden;
  background: #050505;
}
.bmg-hybrid-photo img {
  width: 100%; height: 100%;
  object-fit: contain;
  display: block;
  filter: brightness(0.85);
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}
.bmg-hybrid-info {
  padding: 12px 14px;
  border-top: 1px solid var(--bmg-border);
}
.bmg-hybrid-cross {
  font-family: var(--bmg-font-d);
  font-style: italic;
  font-size: 13px;
  color: var(--bmg-white);
  line-height: 1.4;
}

/* ── LIGHTBOX MODAL ── */
.bmg-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.96);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.bmg-modal-overlay.open {
  opacity: 1;
  pointer-events: all;
}
.bmg-modal-inner {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.bmg-modal-img {
  max-width: 90vw;
  max-height: 78vh;
  object-fit: contain;
  display: block;
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  -webkit-user-select: none;
}
.bmg-modal-caption {
  font-size: 11px;
  letter-spacing: 0.1em;
  color: var(--bmg-dimmer);
  text-align: center;
  font-style: italic;
  font-family: var(--bmg-font-d);
}
.bmg-modal-close {
  position: absolute;
  top: 20px; right: 24px;
  font-size: 28px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  background: rgba(0,0,0,0.35);
  border: none;
  padding: 8px 12px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
  z-index: 10001;
  border-radius: 2px;
  pointer-events: auto;
}
.bmg-modal-close:hover { color: var(--bmg-white); }
.bmg-modal-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  font-size: 36px;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  background: rgba(0,0,0,0.35);
  border: none;
  padding: 16px 20px;
  line-height: 1;
  transition: color 0.15s, background 0.15s;
  z-index: 10001;
  border-radius: 2px;
  pointer-events: auto;
}
.bmg-modal-nav:hover { color: var(--bmg-white); background: rgba(0,0,0,0.6); }
.bmg-modal-prev { left: 12px; }
.bmg-modal-next { right: 12px; }

/* ── EMPTY STATE ── */
.bmg-empty {
  padding: 80px 0;
  text-align: center;
  color: var(--bmg-dimmer);
}
.bmg-empty-title {
  font-family: var(--bmg-font-d);
  font-size: 22px;
  font-weight: 300;
  font-style: italic;
  color: var(--bmg-dim);
  margin-bottom: 10px;
}
.bmg-empty-sub {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

/* ── ANIMATIONS ── */
@keyframes bmg-fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.bmg-fade-up {
  animation: bmg-fadeUp 0.35s ease forwards;
}
.bmg-stagger > * {
  opacity: 0;
  animation: bmg-fadeUp 0.3s ease forwards;
}
.bmg-stagger > *:nth-child(1)  { animation-delay: 0.04s; }
.bmg-stagger > *:nth-child(2)  { animation-delay: 0.08s; }
.bmg-stagger > *:nth-child(3)  { animation-delay: 0.12s; }
.bmg-stagger > *:nth-child(4)  { animation-delay: 0.16s; }
.bmg-stagger > *:nth-child(5)  { animation-delay: 0.20s; }
.bmg-stagger > *:nth-child(6)  { animation-delay: 0.24s; }
.bmg-stagger > *:nth-child(n+7){ animation-delay: 0.28s; }

/* ── FOOTER ── */
.bmg-footer {
  padding: 28px 64px;
  border-top: 1px solid var(--bmg-border);
  margin-top: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}
.bmg-footer-copy {
  font-size: 10px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--bmg-dimmer);
}
.bmg-footer-site {
  font-size: 10px;
  letter-spacing: 0.1em;
  color: var(--bmg-dimmer);
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .bmg-header { padding: 36px 24px 28px; }
  .bmg-header-sub { font-size: 11px; }
  .bmg-controls { padding: 18px 24px; gap: 12px; }
  .bmg-search { font-size: 16px; padding: 18px 14px 18px 50px; }
  .bmg-search-icon { font-size: 17px; left: 14px; width: 22px; }
  .bmg-filter-select { min-width: calc(50% - 5px); font-size: 14px; padding: 18px 30px 18px 12px; }
  .bmg-filter-label { font-size: 12px; }
  .bmg-results-count { font-size: 13px; }
  .bmg-breadcrumb { padding: 10px 24px; }
  .bmg-main { padding: 28px 24px; }
  .bmg-genus-grid { grid-template-columns: 1fr; }
  .bmg-species-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 10px; }
  .bmg-cultivars-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
  .bmg-care-grid { grid-template-columns: 1fr; }
  .bmg-hybrids-search { max-width: 100%; }
  .bmg-detail-hero { grid-template-columns: 1fr; gap: 28px; }
  .bmg-footer { padding: 24px 24px; }
}
@media (max-width: 480px) {
  .bmg-header-title { font-size: 40px; }
  .bmg-search { font-size: 16px; padding: 16px 14px 16px 50px; } /* font-size: 16px prevents iOS zoom on focus */
  .bmg-filter-select { min-width: 100%; font-size: 16px; padding: 16px 30px 16px 12px; } /* 16px prevents iOS zoom + full width */
  .bmg-species-grid { grid-template-columns: repeat(2, 1fr); }
  .bmg-cultivars-grid { grid-template-columns: repeat(2, 1fr); }
}
`;

  // ─── STATE ────────────────────────────────────────────────────
  let DATA = null;

  let STATE = {
    view:          'genera',
    genus:         null,
    taxonId:       null,
    parentId:      null,
    activeGroup:   'all',
    search:        '',
    filterGenus:   'all',
    filterHabitat: 'all',
    filterCountry: 'all',
    filterClimate: 'all',
    filterGroup:   'all',
    modalPhotos:   [],
    modalIndex:    0,
    modalTaxonId:  null
  };

  let _slideshowTimers = [];

  // ─── INJECT STYLES ────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('bmg-styles')) return;
    const style = document.createElement('style');
    style.id = 'bmg-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    // Google Fonts
    if (!document.querySelector('link[href*="Cormorant+Garamond"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Josefin+Sans:wght@200;300;400&display=swap';
      document.head.appendChild(link);
    }
  }

  // ─── INJECT SHELL HTML ────────────────────────────────────────
  // Adds the modal overlay + root loading state to the document
  function injectShell() {
    const root = document.getElementById('bmg-root');
    if (!root) return;

    root.innerHTML = '<div class="bmg-loading"><div class="bmg-spinner"></div><div class="bmg-loading-text">Loading collection</div></div>';

    // Lightbox modal — placed outside bmg-root so it's not wiped by render()
    if (!document.getElementById('bmg-modal')) {
      const modal = document.createElement('div');
      modal.className = 'bmg-modal-overlay';
      modal.id = 'bmg-modal';
      modal.innerHTML = [
        '<button class="bmg-modal-close" id="bmg-modal-close">\u00D7</button>',
        '<button class="bmg-modal-nav bmg-modal-prev" id="bmg-modal-prev">&#8249;</button>',
        '<button class="bmg-modal-nav bmg-modal-next" id="bmg-modal-next">&#8250;</button>',
        '<div class="bmg-modal-inner">',
        '  <img class="bmg-modal-img" id="bmg-modal-img" src="" alt="">',
        '  <div class="bmg-modal-caption" id="bmg-modal-caption"></div>',
        '</div>'
      ].join('');
      document.body.appendChild(modal);
      attachModalEvents();
    }
  }

  // ─── DATA FETCH ───────────────────────────────────────────────
  async function fetchData() {
    const res = await fetch(CONFIG.DATA_URL);
    if (!res.ok) throw new Error('Could not load collection data (HTTP ' + res.status + ').');
    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch(e) { throw new Error('Invalid data format.'); }
    if (!data || !data.taxa) throw new Error('Unexpected data format.');
    return data;
  }

  // ─── DATA PROCESSING ─────────────────────────────────────────
  // v2 data.json already has typed objects — minimal massaging needed
  function processData(raw) {
    const habitatMap = {};
    (raw.habitats || []).forEach(function (h) { if (h.id) habitatMap[h.id] = h.name; });

    const climateMap = {};
    (raw.climates || []).forEach(function (c) { if (c.id) climateMap[c.id] = c.name; });

    const groupCareDefaults = raw.groupCareDefaults || {};

    const taxa = (raw.taxa || []).map(function (t) {
      // Normalise photos: may already be an array or a pipe-separated string
      let photos = [];
      if (Array.isArray(t.photos)) {
        photos = t.photos.filter(Boolean);
      } else if (typeof t.photos === 'string' && t.photos) {
        photos = t.photos.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
      }

      // Normalise shop_links
      let shopLinks = [];
      if (Array.isArray(t.shop_links)) {
        shopLinks = t.shop_links;
      } else if (typeof t.shop_links === 'string' && t.shop_links) {
        try { shopLinks = JSON.parse(t.shop_links); } catch (e) {}
      } else if (Array.isArray(t.shopLinks)) {
        shopLinks = t.shopLinks;
      }

      // Normalise external_links
      let externalLinks = [];
      if (Array.isArray(t.external_links)) {
        externalLinks = t.external_links;
      } else if (typeof t.external_links === 'string' && t.external_links) {
        try { externalLinks = JSON.parse(t.external_links); } catch (e) {}
      } else if (Array.isArray(t.externalLinks)) {
        externalLinks = t.externalLinks;
      }
      // Filter out entries with no URL
      externalLinks = externalLinks.filter(function (el) { return el && el.url; });

      // Care — may be flat fields or a nested care object
      const careOverride = (t.care_override === true || t.care_override === 'TRUE') ||
                           (t.care && t.care.override === true);
      const rawCare = t.care || {};
      const care = {
        light:    t.care_light    || rawCare.light    || '',
        water:    t.care_water    || rawCare.water    || '',
        soil:     t.care_soil     || rawCare.soil     || '',
        dormancy: t.care_dormancy || rawCare.dormancy || '',
        temp:     t.care_temp     || rawCare.temp     || '',
        notes:    t.care_notes    || rawCare.notes    || '',
        override: careOverride
      };

      // Resolve care inheritance: if override=false, merge group defaults
      const group = t.group || rawCare.group || '';
      if (!careOverride && group && groupCareDefaults[group]) {
        const def = groupCareDefaults[group];
        if (!care.light    && def.light)    care.light    = def.light;
        if (!care.water    && def.water)    care.water    = def.water;
        if (!care.soil     && def.soil)     care.soil     = def.soil;
        if (!care.dormancy && def.dormancy) care.dormancy = def.dormancy;
        if (!care.temp     && def.temp)     care.temp     = def.temp;
        if (!care.notes    && def.notes)    care.notes    = def.notes;
      }

      const habitatId   = t.habitat_id  || t.habitatId  || '';
      const habitatName = habitatMap[habitatId] || habitatId || '';
      const climate     = t.climate || '';

      return {
        id:           t.id           || '',
        genus:        t.genus        || '',
        species:      t.species      || '',
        subspecies:   t.subspecies_cultivar || t.subspecies || '',
        entryType:    t.entry_type   || t.entryType   || 'species',
        displayName:  t.display_name || t.displayName || '',
        commonName:   t.common_name  || t.commonName  || '',
        group:        group,
        photos:       photos,
        country:      t.country      || '',
        habitatId:    habitatId,
        habitatName:  habitatName,
        climate:      climate,
        nativeRange:  t.native_range || t.nativeRange || '',
        nativeHabitat:t.native_habitat || t.nativeHabitat || '',
        care:         care,
        shopLinks:    shopLinks,
        externalLinks:externalLinks,
        notes:        t.notes  || '',
        parentId:     t.parent_id || t.parentId || '',
        isHybrid:     t.is_hybrid === true || t.is_hybrid === 'TRUE' || t.isHybrid === true,
        isGrex:       t.is_grex  === true || t.is_grex  === 'TRUE'  || t.isGrex  === true
      };
    }).filter(function (t) { return t.genus && t.displayName; });

    // Sort: genus → species → subspecies; hybrids after; grex last
    const collator    = new Intl.Collator('en', { sensitivity: 'base' });
    const topLevel    = taxa.filter(function (t) { return !t.parentId; });
    const children    = taxa.filter(function (t) { return !!t.parentId; });

    topLevel.sort(function (a, b) {
      const g = collator.compare(a.genus, b.genus);
      if (g !== 0) return g;
      if (a.isGrex !== b.isGrex) return a.isGrex ? 1 : -1;
      if (a.isHybrid !== b.isHybrid && !a.isGrex && !b.isGrex) return a.isHybrid ? 1 : -1;
      return collator.compare(a.species || a.displayName, b.species || b.displayName);
    });
    children.sort(function (a, b) { return collator.compare(a.displayName, b.displayName); });

    const sorted = [];
    topLevel.forEach(function (parent) {
      sorted.push(parent);
      const kids = children.filter(function (c) { return c.parentId === parent.id; });
      kids.sort(function (a, b) { return collator.compare(a.displayName, b.displayName); });
      kids.forEach(function (k) { sorted.push(k); });
    });
    // Orphaned children (parent id not found among top-level)
    children.forEach(function (c) {
      if (!sorted.find(function (s) { return s.id === c.id; })) sorted.push(c);
    });

    // genusCoverPhotos
    const genusCoverPhotos = {};
    if (raw.genusCoverPhotos && typeof raw.genusCoverPhotos === 'object') {
      Object.keys(raw.genusCoverPhotos).forEach(function (genus) {
        const val = raw.genusCoverPhotos[genus];
        if (Array.isArray(val)) {
          genusCoverPhotos[genus] = val.filter(Boolean);
        } else if (typeof val === 'string' && val) {
          genusCoverPhotos[genus] = val.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
        }
      });
    }

    // Build O(1) lookup map — replaces repeated DATA.taxa.find() calls
    var taxaById = new Map();
    sorted.forEach(function (t) { taxaById.set(t.id, t); });

    // Precompute filter dropdown options once — renderControls() reads these
    var topLevelTaxa = sorted.filter(function (t) { return !t.parentId; });
    var filterOpts = {
      genera:    uniqueSorted(topLevelTaxa.map(function (t) { return t.genus; }).filter(Boolean)),
      habitats:  uniqueSorted(topLevelTaxa.filter(function (t) { return t.habitatId; }).map(function (t) { return t.habitatId; })),
      countries: uniqueSorted(sorted.filter(function (t) { return t.country; }).map(function (t) { return t.country; })),
      climates:  uniqueSorted(sorted.filter(function (t) { return t.climate; }).map(function (t) { return t.climate; })),
      groups:    uniqueSorted(topLevelTaxa.filter(function (t) { return t.group; }).map(function (t) { return t.group; }))
    };

    return {
      taxa:              sorted,
      taxaById:          taxaById,
      filterOpts:        filterOpts,
      habitats:          habitatMap,
      climates:          climateMap,
      genusCoverPhotos:  genusCoverPhotos,
      groupCareDefaults: groupCareDefaults,
      siteContent:       raw.siteContent || {}
    };
  }

  // ─── UTILITY ──────────────────────────────────────────────────
  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Resolve photo URL — strips sq: prefix, converts drive: to public thumbnail URL
  function resolvePhoto(src, size) {
    if (!src) return '';
    if (src.startsWith('sq:'))    return src.slice(3);
    if (src.startsWith('drive:')) return 'https://drive.google.com/thumbnail?id=' + src.slice(6) + '&sz=' + (size || 'w800');
    return src;
  }

  function capitalizeHabitat(str) {
    if (!str) return '';
    const s = String(str).replace(/_/g, ' ');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // Format display name with correct italic/quote semantics
  function formatDisplayName(t) {
    const name = esc(t.displayName);
    if (t.entryType === 'cultivar_reg') {
      const parts = name.split("'");
      if (parts.length >= 3) return '<em>' + parts[0] + "</em>'" + parts[1] + "'";
      return '<em>' + name + '</em>';
    }
    if (t.entryType === 'cultivar_unreg') {
      const parts = name.split('"');
      if (parts.length >= 3) return '<em>' + parts[0] + '</em>"' + parts[1] + '"';
      return '<em>' + name + '</em>';
    }
    if (t.entryType === 'location') {
      const parenIdx = name.indexOf('(');
      if (parenIdx > -1) {
        return '<em>' + name.substring(0, parenIdx).trim() + '</em> ' + name.substring(parenIdx);
      }
      return '<em>' + name + '</em>';
    }
    return '<em>' + name + '</em>';
  }

  // ─── HASH ROUTING ─────────────────────────────────────────────

  function stateToHash(s) {
    var v = s.view || 'genera';
    if (v === 'species') return '#/genus/' + encodeURIComponent(s.genus || '');
    if (v === 'hybrids') return '#/genus/' + encodeURIComponent(s.genus || '') + '/hybrids';
    if (v === 'detail')  return '#/taxon/' + encodeURIComponent(s.taxonId || '');
    if (v === 'forms')   return '#/forms/' + encodeURIComponent(s.parentId || '');
    return '#/';
  }

  function hashToState(hash) {
    var h = (hash || '').replace(/^#\/?/, '');
    var parts = h.split('/').map(function (p) { return decodeURIComponent(p); });
    if (!h) return { view: 'genera' };
    if (parts[0] === 'genus' && parts[1]) {
      if (parts[2] === 'hybrids') return { view: 'hybrids', genus: parts[1] };
      return { view: 'species', genus: parts[1] };
    }
    if (parts[0] === 'taxon' && parts[1]) {
      var td = DATA && DATA.taxa.find(function (x) { return x.id === parts[1]; });
      return { view: 'detail', taxonId: parts[1], genus: td ? td.genus : null, parentId: td ? (td.parentId || null) : null };
    }
    if (parts[0] === 'forms' && parts[1]) {
      var tp = DATA && DATA.taxa.find(function (x) { return x.id === parts[1]; });
      return { view: 'forms', parentId: parts[1], genus: tp ? tp.genus : null };
    }
    return { view: 'genera' };
  }

  function applyHashState(s) {
    STATE.view     = s.view     || 'genera';
    STATE.genus    = s.genus    || null;
    STATE.taxonId  = s.taxonId  || null;
    STATE.parentId = s.parentId || null;
    if (STATE.view === 'genera') {
      STATE.search = ''; STATE.filterGenus = 'all'; STATE.activeGroup = 'all';
    }
    if (STATE.view === 'species') STATE.activeGroup = 'all';
    render();
    if (STATE.view === 'genera') startGenusSlideshow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function attachPopstate() {
    window.addEventListener('popstate', function (e) {
      var s = (e.state && e.state.view) ? e.state : hashToState(window.location.hash);
      applyHashState(s);
    });
  }

  // ─── NAVIGATION ───────────────────────────────────────────────
  function navigate(view, genus, taxonId, parentId) {
    STATE.view    = view    || 'genera';
    STATE.genus   = genus   || null;
    STATE.taxonId = taxonId || null;
    STATE.parentId= parentId|| null;

    if (view === 'genera') {
      STATE.search      = '';
      STATE.filterGenus = 'all';
      STATE.activeGroup = 'all';
      var inp = document.getElementById('bmg-search-input');
      if (inp) inp.value = '';
    }
    if (view === 'species') {
      STATE.activeGroup = 'all';
    }

    // Push a history entry so back/forward work
    var hash = stateToHash(STATE);
    var histData = { view: view, genus: genus || null, taxonId: taxonId || null, parentId: parentId || null };
    if (window.location.hash !== hash) {
      history.pushState(histData, '', hash);
    }

    render();
    if (view === 'genera') startGenusSlideshow();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── RENDER ENGINE ────────────────────────────────────────────
  function render() {
    const root = document.getElementById('bmg-root');
    if (!root || !DATA) return;

    // Build filtered taxa list
    let filtered = DATA.taxa;
    const s = STATE.search.toLowerCase().trim();
    if (s) {
      filtered = filtered.filter(function (t) {
        return t.displayName.toLowerCase().includes(s) ||
               t.commonName.toLowerCase().includes(s) ||
               t.nativeRange.toLowerCase().includes(s) ||
               (t.group || '').toLowerCase().includes(s);
      });
    }
    if (STATE.filterGenus   !== 'all') filtered = filtered.filter(function (t) { return t.genus === STATE.filterGenus; });
    if (STATE.filterHabitat !== 'all') filtered = filtered.filter(function (t) { return t.habitatId === STATE.filterHabitat; });
    if (STATE.filterCountry !== 'all') filtered = filtered.filter(function (t) { return t.country === STATE.filterCountry; });
    if (STATE.filterClimate !== 'all') filtered = filtered.filter(function (t) { return t.climate === STATE.filterClimate; });
    if (STATE.filterGroup   !== 'all') filtered = filtered.filter(function (t) { return (t.group || '') === STATE.filterGroup; });

    root.innerHTML = renderShell(filtered);
  }

  function renderShell(filtered) {
    let mainContent = '';
    if (STATE.view === 'genera')  mainContent = renderGenera(filtered);
    if (STATE.view === 'species') mainContent = renderSpecies(filtered);
    if (STATE.view === 'forms')   mainContent = renderForms();
    if (STATE.view === 'detail')  mainContent = renderDetail();
    if (STATE.view === 'hybrids') mainContent = renderHybrids();

    return renderHeader() + renderControls(filtered) + renderBreadcrumb() +
           '<div class="bmg-main">' + mainContent + '</div>' + renderFooter();
  }

  // ── Header ──
  function renderHeader() {
    var sc       = (DATA && DATA.siteContent) || {};
    var eyebrow  = sc.eyebrow  || 'Bogman Plantenstein \u00B7 Grow Collection';
    var title    = sc.title    || 'Photos';
    var subtitle = sc.subtitle || 'Carnivorous plant photo reference & species gallery';
    var szStyle  = function (v) { return v ? ' style="font-size:' + esc(v) + '"' : ''; };

    var descHtml = '';
    if (STATE.view === 'genera' && sc.description) {
      descHtml = '<div class="bmg-header-desc"' + szStyle(sc.descriptionSize) + '>' + sc.description + '</div>';
    }

    return '<div class="bmg-header">' +
      '<div class="bmg-header-eyebrow"' + szStyle(sc.eyebrowSize) + '>' + esc(eyebrow) + '</div>' +
      '<h1 class="bmg-header-title"' + szStyle(sc.titleSize) + '>' + esc(title) + '</h1>' +
      '<div class="bmg-header-sub"' + szStyle(sc.subtitleSize) + '>' + esc(subtitle) + '</div>' +
      descHtml +
      '</div>';
  }

  function renderFooter() {
    return '<div class="bmg-footer">' +
      '<div class="bmg-footer-copy">\u00A9 ' + new Date().getFullYear() + ' Bogman Plantenstein \u00B7 All photos copyright, all rights reserved</div>' +
      '<div class="bmg-footer-site">burymeinthebog.com</div>' +
      '</div>';
  }

  // ── Controls ──
  function renderControls(filtered) {
    const opts      = DATA.filterOpts;
    const genera    = opts.genera;
    const habitats  = opts.habitats;
    const countries = opts.countries;
    const climates  = opts.climates;
    const groups    = opts.groups;
    const count     = filtered.length;

    const showFilters = (STATE.view === 'genera' || STATE.view === 'species');

    let filtersHtml = '';
    if (showFilters) {
      let genusOptions = '<option value="all">All Genera</option>';
      genera.forEach(function (g) {
        genusOptions += '<option value="' + esc(g) + '"' + (STATE.filterGenus === g ? ' selected' : '') + '>' + esc(g) + '</option>';
      });

      let groupOptions = '<option value="all">All Groups</option>';
      groups.forEach(function (g) {
        groupOptions += '<option value="' + esc(g) + '"' + (STATE.filterGroup === g ? ' selected' : '') + '>' + esc(g) + '</option>';
      });

      let habitatOptions = '<option value="all">All Habitats</option>';
      habitats.forEach(function (h) {
        const label = capitalizeHabitat(DATA.habitats[h] || h);
        habitatOptions += '<option value="' + esc(h) + '"' + (STATE.filterHabitat === h ? ' selected' : '') + '>' + esc(label) + '</option>';
      });

      let countryOptions = '<option value="all">All Countries</option>';
      countries.forEach(function (c) {
        countryOptions += '<option value="' + esc(c) + '"' + (STATE.filterCountry === c ? ' selected' : '') + '>' + esc(c) + '</option>';
      });

      let climateOptions = '<option value="all">All Climates</option>';
      climates.forEach(function (c) {
        climateOptions += '<option value="' + esc(c) + '"' + (STATE.filterClimate === c ? ' selected' : '') + '>' + esc(c) + '</option>';
      });

      filtersHtml = '<div class="bmg-filter-row">' +
        '<span class="bmg-filter-label">Filter</span>' +
        '<select class="bmg-filter-select" id="bmg-filter-genus">' + genusOptions + '</select>' +
        (groups.length ? '<select class="bmg-filter-select" id="bmg-filter-group">' + groupOptions + '</select>' : '') +
        '<select class="bmg-filter-select" id="bmg-filter-habitat">' + habitatOptions + '</select>' +
        '<select class="bmg-filter-select" id="bmg-filter-country">' + countryOptions + '</select>' +
        '<select class="bmg-filter-select" id="bmg-filter-climate">' + climateOptions + '</select>' +
        '</div>';
    }

    return '<div class="bmg-controls">' +
      '<div class="bmg-search-row">' +
        '<div class="bmg-search-wrap">' +
          '<span class="bmg-search-icon">\u2315</span>' +
          '<input id="bmg-search-input" class="bmg-search" type="text" ' +
            'placeholder="Search species, cultivar, region..." ' +
            'value="' + esc(STATE.search) + '">' +
        '</div>' +
        (filtersHtml ? '<div class="bmg-results-count">' + filtered.length + ' ' + (filtered.length === 1 ? 'taxon' : 'taxa') + '</div>' : '') +
      '</div>' +
      filtersHtml +
      '</div>';
  }

  // ── Breadcrumb ──
  function renderBreadcrumb() {
    let html = '<span class="bmg-bc-item' + (STATE.view === 'genera' ? ' active' : '') + '" data-nav-genera>Collection</span>';

    if (STATE.genus && STATE.view !== 'genera') {
      const speciesActive = (STATE.view === 'species' || STATE.view === 'hybrids');
      html += '<span class="bmg-bc-sep">\u203A</span>' +
              '<span class="bmg-bc-item' + (speciesActive ? ' active' : '') + '" data-nav-species="' + esc(STATE.genus) + '">' +
              '<em>' + esc(STATE.genus) + '</em></span>';
    }

    if ((STATE.view === 'forms' || STATE.view === 'detail') && STATE.parentId) {
      const parent = DATA.taxa.find(function (x) { return x.id === STATE.parentId; });
      if (parent) {
        html += '<span class="bmg-bc-sep">\u203A</span>' +
                '<span class="bmg-bc-item' + (STATE.view === 'forms' ? ' active' : '') + '" data-nav-forms="' + esc(parent.id) + '">' +
                formatDisplayName(parent) + '</span>';
      }
    }

    if (STATE.view === 'detail' && STATE.taxonId) {
      const t = DATA.taxa.find(function (x) { return x.id === STATE.taxonId; });
      if (t && t.parentId) {
        html += '<span class="bmg-bc-sep">\u203A</span>' +
                '<span class="bmg-bc-item active">' + formatDisplayName(t) + '</span>';
      } else if (t && !t.parentId && !STATE.parentId) {
        html += '<span class="bmg-bc-sep">\u203A</span>' +
                '<span class="bmg-bc-item active">' + formatDisplayName(t) + '</span>';
      }
    }

    if (STATE.view === 'hybrids') {
      html += '<span class="bmg-bc-sep">\u203A</span><span class="bmg-bc-item active">Hybrids</span>';
    }

    return '<div class="bmg-breadcrumb">' + html + '</div>';
  }

  // ── GENERA VIEW ──
  function renderGenera(filtered) {
    const genera = uniqueSorted(
      filtered.filter(function (t) { return !t.isGrex; }).map(function (t) { return t.genus; })
    );

    const genusCommonNames = {
      'Drosera':      'Sundews',
      'Pinguicula':   'Butterworts',
      'Utricularia':  'Bladderworts',
      'Byblis':       'Rainbow Plants',
      'Drosophyllum': 'Dewy Pine',
      'Dionaea':      'Venus Flytrap'
    };

    if (!genera.length) return renderEmpty('No genera match your search');

    let cards = '';
    genera.forEach(function (g) {
      const genusTaxa     = filtered.filter(function (t) { return t.genus === g && !t.isGrex; });
      const speciesCount  = genusTaxa.filter(function (t) { return !t.parentId; }).length;
      const cultivarCount = genusTaxa.filter(function (t) { return !!t.parentId; }).length;
      const hasHybrids    = DATA.taxa.some(function (t) { return t.genus === g && t.isGrex; });
      const common        = genusCommonNames[g] || '';

      const coverPhotos = [];
      const manualCovers = DATA.genusCoverPhotos && DATA.genusCoverPhotos[g];
      if (manualCovers && manualCovers.length) {
        const picked = manualCovers.slice(0, 4);
        picked.forEach(function (p) { coverPhotos.push(resolvePhoto(p)); });
      } else {
        genusTaxa.filter(function (t) { return !t.parentId && t.photos.length > 0; })
          .slice(0, 4)
          .forEach(function (t) { coverPhotos.push(resolvePhoto(t.photos[0])); });
      }

      const photoSlideArr = [];
      coverPhotos.forEach(function (ph, i) {
        photoSlideArr.push('<div class="bmg-genus-photo-slide' + (i === 0 ? ' active' : '') + '" ' +
          'style="background-image:url(\'' + esc(ph) + '\')" data-slide></div>');
      });
      const photoSlides = photoSlideArr.join('');

      const photoParts = coverPhotos.length
        ? '<div class="bmg-genus-photo-wrap">' + photoSlides + '</div><div class="bmg-genus-overlay"></div>'
        : '';

      const hybridsStat = hasHybrids
        ? '<div><span class="bmg-genus-stat-val" style="color:var(--bmg-dimmer)">\u00D7</span>' +
          '<span class="bmg-genus-stat-label">Hybrids</span></div>'
        : '';

      const cultivarStat = cultivarCount
        ? '<div><span class="bmg-genus-stat-val">' + cultivarCount + '</span>' +
          '<span class="bmg-genus-stat-label">Cultivars</span></div>'
        : '';

      cards += '<div class="bmg-genus-card bmg-fade-up" ' +
        'data-nav-species="' + esc(g) + '" ' +
        'data-genus-card="' + esc(g) + '" ' +
        'data-slide-index="0" ' +
        'data-slide-count="' + coverPhotos.length + '">' +
        photoParts +
        '<div class="bmg-genus-card-content">' +
          '<span class="bmg-genus-arrow">\u2192</span>' +
          '<div class="bmg-genus-name"><em>' + esc(g) + '</em></div>' +
          (common ? '<div class="bmg-genus-common">' + esc(common) + '</div>' : '<div class="bmg-genus-common">&nbsp;</div>') +
          '<div class="bmg-genus-stats">' +
            '<div><span class="bmg-genus-stat-val">' + speciesCount + '</span>' +
            '<span class="bmg-genus-stat-label">Species</span></div>' +
            cultivarStat + hybridsStat +
          '</div>' +
        '</div>' +
        '</div>';
    });

    return '<div class="bmg-genus-grid bmg-stagger">' + cards + '</div>';
  }

  // ── SPECIES VIEW ──
  function renderSpecies(filtered) {
    const g          = STATE.genus;
    const genusTaxa  = filtered.filter(function (t) { return t.genus === g && !t.isGrex; });
    const topLevel   = genusTaxa.filter(function (t) { return !t.parentId; });
    const hasHybrids = DATA.taxa.some(function (t) { return t.genus === g && t.isGrex; });
    const namedHybridsTL = genusTaxa.filter(function (t) { return t.isHybrid && !t.isGrex && !topLevel.find(function (x) { return x.id === t.id; }); });

    if (!topLevel.length && !namedHybridsTL.length) {
      return '<button class="bmg-back-btn" data-nav-genera>\u2190 Collection</button>' +
             renderEmpty('No species match your search');
    }

    // Group tabs
    const allGenusTaxa = DATA.taxa.filter(function (t) { return t.genus === g && !t.isGrex && !t.parentId; });
    const groups = uniqueSorted(allGenusTaxa.map(function (t) { return t.group || ''; }).filter(Boolean));
    const showTabs = groups.length > 0;

    const activeGroup = STATE.activeGroup || 'all';
    const allCandidates = topLevel.concat(namedHybridsTL);
    const visibleTaxa = (!showTabs || activeGroup === 'all')
      ? allCandidates
      : allCandidates.filter(function (t) { return (t.group || '') === activeGroup; });

    let tabsHtml = '';
    if (showTabs) {
      let tabItems = '<button class="bmg-group-tab' + (activeGroup === 'all' ? ' active' : '') + '" data-group-tab="all">' +
        'All<span class="bmg-group-tab-count">' + allCandidates.length + '</span></button>';
      groups.forEach(function (grp) {
        const cnt = allCandidates.filter(function (t) { return (t.group || '') === grp; }).length;
        tabItems += '<button class="bmg-group-tab' + (activeGroup === grp ? ' active' : '') + '" data-group-tab="' + esc(grp) + '">' +
          esc(grp) + '<span class="bmg-group-tab-count">' + cnt + '</span></button>';
      });
      tabsHtml = '<div class="bmg-group-tabs">' + tabItems + '</div>';
    }

    const speciesCardArr = [];
    visibleTaxa.forEach(function (t) {
      const kids  = DATA.taxa.filter(function (c) { return c.parentId === t.id; });
      // Fall back to first child photo when parent has no photos of its own
      const kidPhoto = !t.photos[0] && kids.length
        ? ((kids.find(function (c) { return c.photos && c.photos.length; }) || {}).photos || [])[0]
        : null;
      const photo = resolvePhoto(t.photos[0] || kidPhoto, 'w400');
      const tag   = kids.length ? kids.length + ' form' + (kids.length > 1 ? 's' : '') : '';
      const navAttr = kids.length
        ? 'data-nav-forms="' + esc(t.id) + '"'
        : 'data-nav-detail="' + esc(t.id) + '"';

      speciesCardArr.push('<div class="bmg-species-card" ' + navAttr + '>' +
        '<div class="bmg-species-photo-wrap">' +
        (photo
          ? '<img class="bmg-species-photo" src="' + esc(photo) + '" alt="' + esc(t.displayName) + '" loading="lazy">'
          : '<div class="bmg-species-no-photo">No photo</div>') +
        (tag ? '<span class="bmg-species-tag">' + tag + '</span>' : '') +
        '</div>' +
        '<div class="bmg-species-name">' + formatDisplayName(t) + '</div>' +
        (t.commonName ? '<div class="bmg-species-sub">' + esc(t.commonName) + '</div>' : '') +
        '</div>');
    });
    const speciesCards = speciesCardArr.join('');

    const emptyMsg = visibleTaxa.length === 0
      ? renderEmpty('No ' + (activeGroup !== 'all' ? esc(activeGroup) + ' ' : '') + 'species match your search')
      : '';

    const hybridsLink = hasHybrids
      ? '<button class="bmg-back-btn" data-nav-hybrids="' + esc(g) + '" style="color:var(--bmg-dimmer)">Hybrids \u2192</button>'
      : '';

    return '<div class="bmg-species-header">' +
      '<div>' +
        '<button class="bmg-back-btn" data-nav-genera>\u2190 Collection</button>' +
        '<div class="bmg-species-title"><em>' + esc(g) + '</em></div>' +
      '</div>' +
      hybridsLink +
      '</div>' +
      tabsHtml +
      (emptyMsg || '<div class="bmg-species-grid bmg-stagger">' + speciesCards + '</div>');
  }

  // ── FORMS VIEW ──
  function renderForms() {
    const parent = DATA.taxa.find(function (x) { return x.id === STATE.parentId; });
    if (!parent) return renderEmpty('Species not found');

    const children = DATA.taxa.filter(function (c) { return c.parentId === parent.id; })
      .sort(function (a, b) { return _collator.compare(a.displayName, b.displayName); });

    const allCards = [parent].concat(children);

    let cardsHtml = '';
    allCards.forEach(function (t) {
      const isParent = t.id === parent.id;
      // For the parent card: fall back to a child photo if the parent has none
      const childPhoto = isParent && !t.photos[0] && children.length
        ? ((children.find(function (c) { return c.photos && c.photos.length; }) || {}).photos || [])[0]
        : null;
      const photo    = resolvePhoto(t.photos[0] || childPhoto, 'w400');
      let label = '';
      if (isParent) {
        label = 'Species';
      } else if (t.entryType === 'cultivar_reg')   { label = 'Registered Cultivar'; }
        else if (t.entryType === 'cultivar_unreg') { label = 'Named Form'; }
        else if (t.entryType === 'location')       { label = 'Location Form'; }

      cardsHtml += '<div class="bmg-species-card" data-nav-detail="' + esc(t.id) + '" data-parent="' + esc(parent.id) + '">' +
        '<div class="bmg-species-photo-wrap">' +
        (photo
          ? '<img class="bmg-species-photo" src="' + esc(photo) + '" alt="' + esc(t.displayName) + '" loading="lazy">'
          : '<div class="bmg-species-no-photo">No photo</div>') +
        (label ? '<span class="bmg-species-tag">' + label + '</span>' : '') +
        '</div>' +
        '<div class="bmg-species-name">' + formatDisplayName(t) + '</div>' +
        (t.commonName ? '<div class="bmg-species-sub">' + esc(t.commonName) + '</div>' : '') +
        '</div>';
    });

    return '<div class="bmg-fade-up">' +
      '<div class="bmg-species-header">' +
        '<div>' +
          '<button class="bmg-back-btn" data-nav-species="' + esc(parent.genus) + '" style="margin-bottom:12px;">' +
            '\u2190 <em>' + esc(parent.genus) + '</em>' +
          '</button>' +
          '<div class="bmg-species-title">' + formatDisplayName(parent) + '</div>' +
          (parent.commonName ? '<div class="bmg-species-sub" style="margin-top:4px;">' + esc(parent.commonName) + '</div>' : '') +
        '</div>' +
      '</div>' +
      '<div style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:var(--bmg-dimmer);margin-bottom:20px;">' +
        children.length + ' form' + (children.length !== 1 ? 's' : '') + ' \u2014 click any card for details' +
      '</div>' +
      '<div class="bmg-species-grid bmg-stagger">' + cardsHtml + '</div>' +
      '</div>';
  }

  // ── DETAIL VIEW ──
  function renderDetail() {
    const t = DATA.taxaById.get(STATE.taxonId) || null;
    if (!t) return renderEmpty('Taxon not found');

    const children = DATA.taxa.filter(function (c) { return c.parentId === t.id; });

    // ── Photo section ──
    const photos    = t.photos;
    const mainPhoto = resolvePhoto(photos[0], 'w800');
    let photoSection = '';

    if (mainPhoto) {
      let thumbsHtml = '';
      if (photos.length > 1) {
        let thumbItems = '';
        photos.forEach(function (ph, i) {
          thumbItems += '<img class="bmg-thumb' + (i === 0 ? ' active' : '') + '" ' +
            'src="' + esc(resolvePhoto(ph, 'w200')) + '" alt="" loading="lazy" ' +
            'data-thumb="' + esc(t.id) + '" data-idx="' + i + '">';
        });
        thumbsHtml = '<div class="bmg-photo-thumbs">' + thumbItems + '</div>';
      }
      photoSection = '<div class="bmg-lightbox-trigger" data-lightbox="' + esc(t.id) + '" data-idx="0">' +
        '<img src="' + esc(mainPhoto) + '" alt="' + esc(t.displayName) + '" loading="eager" fetchpriority="high">' +
        (photos.length > 1 ? '<div class="bmg-photo-count">1 / ' + photos.length + '</div>' : '') +
        '</div>' + thumbsHtml;
    } else {
      photoSection = '<div class="bmg-lightbox-trigger" style="cursor:default;">' +
        '<div class="bmg-species-no-photo">No photo on file</div></div>';
    }

    // ── Entry type badge ──
    const typeBadges = {
      'species':        'Species',
      'location':       'Location Form',
      'cultivar_reg':   'Registered Cultivar',
      'cultivar_unreg': 'Named Form',
      'named_hybrid':   'Named Hybrid',
      'grex':           'Hybrid'
    };
    const badge = typeBadges[t.entryType] || t.entryType;

    // ── Care grid ──
    const careKeys   = ['temp', 'light', 'water', 'soil', 'feeding', 'dormancy', 'notes'];
    const careLabels = { temp: 'Climate', light: 'Light', water: 'Water', soil: 'Soil', feeding: 'Feeding', dormancy: 'Dormancy', notes: 'Notes' };
    let careItemsHtml = '';
    careKeys.forEach(function (k) {
      if (t.care[k]) {
        careItemsHtml += '<div class="bmg-care-item">' +
          '<div class="bmg-care-key">' + careLabels[k] + '</div>' +
          '<div class="bmg-care-val">' + esc(t.care[k]) + '</div>' +
          '</div>';
      }
    });

    // ── Shop links ──
    let shopHtml = '';
    if (t.shopLinks.length) {
      let shopBtns = '';
      t.shopLinks.forEach(function (sl, i) {
        shopBtns += '<a href="' + esc(sl.url) + '" target="_blank" rel="noopener" class="bmg-shop-btn' + (i > 0 ? ' secondary' : '') + '">' +
          esc(sl.label || 'Buy') + ' \u2192</a>';
      });
      shopHtml = '<div class="bmg-shop-row">' + shopBtns + '</div>';
    }

    // ── External links ──
    let extHtml = '';
    if (t.externalLinks.length) {
      let linkItems = '';
      t.externalLinks.forEach(function (el) {
        linkItems += '<a href="' + esc(el.url) + '" target="_blank" rel="noopener" class="bmg-ext-link">' +
          esc(el.site) + '<span class="bmg-ext-link-arrow">\u2197</span></a>';
      });
      extHtml = '<div class="bmg-ext-section">' +
        '<div class="bmg-section-title">More Photos</div>' +
        '<div class="bmg-ext-links">' + linkItems + '</div>' +
        '</div>';
    }

    // ── Cultivars / forms ──
    let cultivarsHtml = '';
    if (children.length) {
      let childCards = '';
      children.forEach(function (c) {
        const cp = resolvePhoto(c.photos[0], 'w400');
        childCards += '<div class="bmg-species-card" data-nav-detail="' + esc(c.id) + '">' +
          '<div class="bmg-species-photo-wrap">' +
          (cp
            ? '<img class="bmg-species-photo" src="' + esc(cp) + '" alt="' + esc(c.displayName) + '" loading="lazy">'
            : '<div class="bmg-species-no-photo">No photo</div>') +
          '</div>' +
          '<div class="bmg-species-name">' + formatDisplayName(c) + '</div>' +
          (c.commonName ? '<div class="bmg-species-sub">' + esc(c.commonName) + '</div>' : '') +
          '</div>';
      });
      cultivarsHtml = '<div class="bmg-cultivars-section">' +
        '<div class="bmg-section-title">Forms &amp; Cultivars</div>' +
        '<div class="bmg-cultivars-grid bmg-stagger">' + childCards + '</div>' +
        '</div>';
    }

    // ── Back button ──
    let backBtn = '';
    if (STATE.parentId && STATE.parentId !== t.id) {
      const parentName = (DATA.taxa.find(function (x) { return x.id === STATE.parentId; }) || {}).displayName || t.genus;
      backBtn = '<button class="bmg-back-btn" data-nav-forms="' + esc(STATE.parentId) + '" style="margin-bottom:28px;">' +
        '\u2190 ' + esc(parentName) + '</button>';
    } else {
      backBtn = '<button class="bmg-back-btn" data-nav-species="' + esc(t.genus) + '" style="margin-bottom:28px;">' +
        '\u2190 <em>' + esc(t.genus) + '</em></button>';
    }

    // ── Native range / habitat fields ──
    const rangeHtml = t.nativeRange
      ? '<div class="bmg-divider"></div><div class="bmg-field-label">Native Range</div>' +
        '<div class="bmg-field-value">' + esc(t.nativeRange) + '</div>'
      : '';
    const habHtml = t.nativeHabitat
      ? '<div class="bmg-field-label">Native Habitat</div>' +
        '<div class="bmg-field-value">' + esc(t.nativeHabitat) + '</div>'
      : '';
    let habitatClimateHtml = '';
    if (t.habitatName || t.climate) {
      let parts = [];
      if (t.habitatName) parts.push('<span>' + esc(capitalizeHabitat(t.habitatName)) + '</span>');
      if (t.climate)     parts.push('<span>' + esc(capitalizeHabitat(t.climate)) + '</span>');
      habitatClimateHtml = '<div class="bmg-field-label">Habitat Type &amp; Climate</div>' +
        '<div class="bmg-field-value">' + parts.join(' \u00B7 ') + '</div>';
    }
    const groupHtml = t.group
      ? '<div class="bmg-field-label">Group</div><div class="bmg-field-value">' + esc(t.group) + '</div>'
      : '';
    const notesHtml = t.notes
      ? '<div class="bmg-field-label">Notes</div><div class="bmg-field-value">' + esc(t.notes) + '</div>'
      : '';

    return '<div class="bmg-detail bmg-fade-up">' +
      backBtn +
      '<div class="bmg-detail-hero">' +
        '<div class="bmg-detail-photos">' + photoSection + '</div>' +
        '<div class="bmg-detail-meta">' +
          '<div class="bmg-detail-genus-label">' + esc(t.genus) + ' \u00B7 ' + esc(badge) + '</div>' +
          '<div class="bmg-detail-name">' + formatDisplayName(t) + '</div>' +
          (t.commonName ? '<div class="bmg-species-sub" style="margin-bottom:16px;">' + esc(t.commonName) + '</div>' : '') +
          shopHtml +
          rangeHtml + habHtml + habitatClimateHtml + groupHtml +
        '</div>' +
      '</div>' +
      (careItemsHtml
        ? '<div class="bmg-section-title">Growing Information</div>' +
          '<div class="bmg-care-grid">' + careItemsHtml + '</div>'
        : '') +
      notesHtml +
      extHtml +
      cultivarsHtml +
      '</div>';
  }

  // ── HYBRIDS VIEW ──
  function renderHybrids() {
    const g  = STATE.genus;
    let hybrids = DATA.taxa.filter(function (t) { return t.genus === g && t.isGrex; });
    const hs = STATE.search.toLowerCase().trim();
    if (hs) hybrids = hybrids.filter(function (t) { return t.displayName.toLowerCase().includes(hs); });

    let cards = '';
    hybrids.forEach(function (h) {
      const p = resolvePhoto(h.photos[0], 'w400');
      cards += '<div class="bmg-hybrid-card">' +
        '<div class="bmg-hybrid-photo">' +
        (p
          ? '<img src="' + esc(p) + '" alt="' + esc(h.displayName) + '" loading="lazy">'
          : '<div class="bmg-species-no-photo" style="height:150px;">No photo</div>') +
        '</div>' +
        '<div class="bmg-hybrid-info">' +
          '<div class="bmg-hybrid-cross">' + esc(h.displayName) + '</div>' +
          (h.country ? '<div class="bmg-species-sub" style="margin-top:4px;">' + esc(h.country) + '</div>' : '') +
        '</div>' +
        '</div>';
    });

    return '<button class="bmg-back-btn" data-nav-species="' + esc(g) + '" style="margin-bottom:24px;">' +
      '\u2190 <em>' + esc(g) + '</em></button>' +
      '<div class="bmg-species-header" style="margin-bottom:20px;">' +
        '<div class="bmg-species-title"><em>' + esc(g) + '</em> Hybrids</div>' +
      '</div>' +
      '<div class="bmg-hybrids-search">' +
        '<input id="bmg-search-input" class="bmg-search" type="text" ' +
          'placeholder="Search hybrids..." value="' + esc(STATE.search) + '" style="max-width:100%;">' +
      '</div>' +
      (hybrids.length ? '<div class="bmg-hybrids-grid bmg-stagger">' + cards + '</div>' : renderEmpty('No hybrids match your search'));
  }

  function renderEmpty(msg) {
    return '<div class="bmg-empty">' +
      '<div class="bmg-empty-title">Nothing found</div>' +
      '<div class="bmg-empty-sub">' + esc(msg) + '</div>' +
      '</div>';
  }

  // ─── GENUS SLIDESHOW ──────────────────────────────────────────
  function startGenusSlideshow() {
    _slideshowTimers.forEach(function (t) { clearInterval(t); });
    _slideshowTimers = [];

    document.querySelectorAll('[data-genus-card]').forEach(function (card) {
      const count = parseInt(card.dataset.slideCount, 10) || 0;
      if (count < 2) return;

      let idx    = 0;
      const slides = card.querySelectorAll('[data-slide]');

      const timer = setInterval(function () {
        slides[idx].classList.remove('active');
        idx = (idx + 1) % slides.length;
        slides[idx].classList.add('active');
      }, 3000);

      _slideshowTimers.push(timer);
    });
  }

  // ─── LIGHTBOX ─────────────────────────────────────────────────
  function swapDetailPhoto(taxonId, idx) {
    var t = DATA.taxa.find(function (x) { return x.id === taxonId; });
    if (!t || !t.photos.length || idx < 0 || idx >= t.photos.length) return;

    var newSrc = resolvePhoto(t.photos[idx], 'w800');

    var trigger = document.querySelector('[data-lightbox="' + taxonId + '"]');
    if (trigger) {
      var img = trigger.querySelector('img');
      if (img) {
        // Always fade out → set new src → fade back in.
        // This guarantees a visible update even when the browser would
        // otherwise skip a re-render because the src string is unchanged
        // (e.g. clicking the first thumbnail when the page just loaded).
        img.classList.add('bmg-photo-swapping');
        img.src = '';                // force a fresh load on next assignment
        img.src = newSrc;
        // Use requestAnimationFrame so the opacity:0 frame is actually
        // painted before we remove the class and trigger the fade-in.
        requestAnimationFrame(function () {
          requestAnimationFrame(function () {
            img.classList.remove('bmg-photo-swapping');
          });
        });
      }
      trigger.dataset.currentIdx = String(idx);
    }

    // Update the "N / total" counter
    var countEl = trigger && trigger.querySelector('.bmg-photo-count');
    if (countEl) countEl.textContent = (idx + 1) + ' / ' + t.photos.length;

    // Update thumbnail active states — use data-idx attribute, not forEach
    // position, so the correct thumb is highlighted regardless of DOM order.
    document.querySelectorAll('.bmg-thumb[data-thumb="' + taxonId + '"]').forEach(function (th) {
      th.classList.toggle('active', parseInt(th.dataset.idx, 10) === idx);
    });
  }

  function openLightbox(taxonId, startIdx) {
    const t = DATA.taxa.find(function (x) { return x.id === taxonId; });
    if (!t || !t.photos.length) return;
    STATE.modalPhotos  = t.photos;
    STATE.modalIndex   = (startIdx != null && !isNaN(startIdx)) ? startIdx : 0;
    STATE.modalTaxonId = taxonId;
    updateModal();
    document.getElementById('bmg-modal').classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function updateModal() {
    const photos = STATE.modalPhotos;
    const idx    = STATE.modalIndex;
    const img    = document.getElementById('bmg-modal-img');
    const cap    = document.getElementById('bmg-modal-caption');
    if (img) img.src = resolvePhoto(photos[idx], 'w1600') || '';
    if (cap) cap.textContent = photos.length > 1 ? (idx + 1) + ' / ' + photos.length : '';

    // Sync the main detail view photo + thumb highlights so they stay in
    // step with the lightbox — prevents the active-thumb / displayed-photo
    // mismatch that made "clicking back to the first image" appear broken.
    if (STATE.modalTaxonId) {
      swapDetailPhoto(STATE.modalTaxonId, idx);
    }
  }

  function closeLightbox() {
    const modal = document.getElementById('bmg-modal');
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  // ─── EVENT DELEGATION ────────────────────────────────────────
  // Called ONCE after first render — root element persists, innerHTML changes are fine
  function attachRootEvents() {
    const root = document.getElementById('bmg-root');
    if (!root) return;

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-nav-genera]')) { navigate('genera'); return; }

      const navSpecies = e.target.closest('[data-nav-species]');
      if (navSpecies) { navigate('species', navSpecies.dataset.navSpecies); return; }

      const groupTab = e.target.closest('[data-group-tab]');
      if (groupTab) {
        STATE.activeGroup = groupTab.dataset.groupTab;
        render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const navDetail = e.target.closest('[data-nav-detail]');
      if (navDetail) {
        const id = navDetail.dataset.navDetail;
        const t  = DATA.taxaById.get(id);
        const parentId = navDetail.dataset.parent || (t && t.parentId ? t.parentId : null) || STATE.parentId || null;
        navigate('detail', t ? t.genus : STATE.genus, id, parentId);
        return;
      }

      const navForms = e.target.closest('[data-nav-forms]');
      if (navForms) {
        const id = navForms.dataset.navForms;
        const t  = DATA.taxaById.get(id);
        navigate('forms', t ? t.genus : STATE.genus, null, id);
        return;
      }

      const navHybrids = e.target.closest('[data-nav-hybrids]');
      if (navHybrids) { navigate('hybrids', navHybrids.dataset.navHybrids); return; }

      const lb = e.target.closest('[data-lightbox]');
      if (lb) {
        const rawIdx = parseInt(lb.dataset.currentIdx || lb.dataset.idx, 10);
        openLightbox(lb.dataset.lightbox, isNaN(rawIdx) ? 0 : rawIdx);
        return;
      }

      const th = e.target.closest('[data-thumb]');
      if (th) {
        const thumbIdx = parseInt(th.dataset.idx, 10);
        swapDetailPhoto(th.dataset.thumb, isNaN(thumbIdx) ? 0 : thumbIdx);
        return;
      }
    });

    // Search — delegated input event with 250ms debounce so typing doesn't trigger
    // a full render on every keystroke. The search input is recreated on each render
    // so we delegate to root rather than binding directly to the element.
    // After render(), refocus the new input element so the user doesn't lose their cursor.
    root.addEventListener('input', function (e) {
      if (e.target.id !== 'bmg-search-input') return;
      STATE.search = e.target.value;
      clearTimeout(_searchDebounce);
      _searchDebounce = setTimeout(function () {
        render();
        var inp = document.getElementById('bmg-search-input');
        if (inp) {
          var len = inp.value.length;
          inp.focus();
          inp.setSelectionRange(len, len);
        }
      }, 250);
    });

    // Filter selects — delegated change event
    root.addEventListener('change', function (e) {
      const id = e.target.id || '';
      if (!id.startsWith('bmg-filter-')) return;
      const f   = id.slice('bmg-filter-'.length);   // genus | group | habitat | country | climate
      const key = 'filter' + f.charAt(0).toUpperCase() + f.slice(1);
      STATE[key] = e.target.value;
      render();
    });

    // Image protection: block right-click + drag on gallery images
    root.addEventListener('contextmenu', function (e) {
      if (e.target.tagName === 'IMG' ||
          e.target.classList.contains('bmg-genus-photo-slide') ||
          e.target.closest('.bmg-species-photo-wrap') ||
          e.target.closest('.bmg-lightbox-trigger')) {
        e.preventDefault();
        return false;
      }
    });
    root.addEventListener('dragstart', function (e) {
      if (e.target.tagName === 'IMG') { e.preventDefault(); return false; }
    });
  }

  // Modal events — attached once
  function attachModalEvents() {
    const modal = document.getElementById('bmg-modal');
    if (!modal) return;

    document.getElementById('bmg-modal-close').addEventListener('click', closeLightbox);

    document.getElementById('bmg-modal-prev').addEventListener('click', function () {
      STATE.modalIndex = (STATE.modalIndex - 1 + STATE.modalPhotos.length) % STATE.modalPhotos.length;
      updateModal();
    });
    document.getElementById('bmg-modal-next').addEventListener('click', function () {
      STATE.modalIndex = (STATE.modalIndex + 1) % STATE.modalPhotos.length;
      updateModal();
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeLightbox();
    });
    modal.addEventListener('contextmenu', function (e) { e.preventDefault(); return false; });
    modal.addEventListener('dragstart',   function (e) { e.preventDefault(); return false; });

    document.addEventListener('keydown', function (e) {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape')     { closeLightbox(); return; }
      if (e.key === 'ArrowLeft')  { STATE.modalIndex = (STATE.modalIndex - 1 + STATE.modalPhotos.length) % STATE.modalPhotos.length; updateModal(); return; }
      if (e.key === 'ArrowRight') { STATE.modalIndex = (STATE.modalIndex + 1) % STATE.modalPhotos.length; updateModal(); }
    });
  }

  // ─── UTILITIES ────────────────────────────────────────────────
  function uniqueSorted(arr) {
    return Array.from(new Set(arr)).sort();
  }

  // Shared collator — created once, reused across all sort operations
  var _collator = new Intl.Collator('en', { sensitivity: 'base' });
  var _searchDebounce = null;

  // ─── INIT ─────────────────────────────────────────────────────
  async function init() {
    injectStyles();
    injectShell();
    attachPopstate();

    var root = document.getElementById('bmg-root');
    if (!root) { console.error('[bmg] No #bmg-root element found.'); return; }

    var hadCache = false;

    // Helper: after DATA is ready, apply any initial hash and stamp history
    function applyInitialHash() {
      var initHash = window.location.hash;
      if (initHash && initHash !== '#' && initHash !== '#/') {
        var s = hashToState(initHash);
        if (s.view !== 'genera') {
          // Resolve genus from data if not in hash (e.g. direct taxon link)
          if (!s.genus && s.taxonId) {
            var t = DATA.taxa.find(function (x) { return x.id === s.taxonId; });
            if (t) { s.genus = t.genus; s.parentId = t.parentId || null; }
          }
          STATE.view = s.view; STATE.genus = s.genus; STATE.taxonId = s.taxonId; STATE.parentId = s.parentId;
          render();
          history.replaceState({ view: STATE.view, genus: STATE.genus, taxonId: STATE.taxonId, parentId: STATE.parentId }, '', stateToHash(STATE));
          return;
        }
      }
      // Default: stamp the genera home state
      history.replaceState({ view: 'genera' }, '', stateToHash(STATE));
      startGenusSlideshow();
    }

    // Step 1: render from cache if available
    try {
      var cached = JSON.parse(sessionStorage.getItem(CONFIG.CACHE_KEY) || 'null');
      if (cached && cached.ts && cached.taxa) {
        DATA = processData(cached);
        root.innerHTML = renderShell(DATA.taxa);
        attachRootEvents();
        applyInitialHash();
        hadCache = true;

        if ((Date.now() - cached.ts) < CONFIG.CACHE_TTL) {
          // Cache is fresh — refresh in background then re-render so published
          // changes (e.g. new header content) appear without a hard refresh
          fetchData().then(function (raw) {
            sessionStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(Object.assign({}, raw, { ts: Date.now() })));
            DATA = processData(raw);
            render();
          }).catch(function () {});
          return;
        }
      }
    } catch (e) {}

    // Step 2: fetch fresh data
    try {
      var raw = await fetchData();
      sessionStorage.setItem(CONFIG.CACHE_KEY, JSON.stringify(Object.assign({}, raw, { ts: Date.now() })));
      DATA = processData(raw);

      if (!hadCache) {
        root.innerHTML = renderShell(DATA.taxa);
        attachRootEvents();
        applyInitialHash();
      } else {
        render(); // stale cache was shown — re-render now with fresh data
      }
    } catch (err) {
      if (!hadCache) {
        root.innerHTML = '<div class="bmg-error">' +
          '<h3>Could not load collection data</h3>' +
          '<p style="margin-top:12px;font-size:11px;color:#444;">' + esc(err.message) + '</p>' +
          '</div>';
      }
    }
  }

  // ─── BOOT ─────────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
