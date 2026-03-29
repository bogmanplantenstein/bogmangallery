'use strict';
// ═══════════════════════════════════════════════════════════════
// BOGMAN GALLERY ADMIN SERVER v2
// Run:  node server.js
// Then: open http://localhost:3001
// ═══════════════════════════════════════════════════════════════

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const fs       = require('fs');
const path     = require('path');
const { execSync, exec } = require('child_process');

const PORT          = process.env.PORT || 3001;
const DATA_FILE     = path.join(__dirname, 'data', 'data.json');
const GITHUB_REPO   = process.env.GITHUB_REPO || '';   // USER/repo
const GITHUB_TOKEN  = process.env.GITHUB_TOKEN || '';  // Personal Access Token (repo scope)
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'admin')));

// ── Helpers ────────────────────────────────────────────────────

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeData(data) {
  data.meta = data.meta || {};
  data.meta.savedAt = new Date().toISOString();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function runGit(cmd) {
  return execSync(cmd, { cwd: __dirname, encoding: 'utf8' }).trim();
}

// Build an authenticated push URL. Always uses an explicit remote URL so the
// repo doesn't need a pre-configured 'origin'. Token is embedded when available;
// otherwise falls back to the plain HTTPS URL (uses system credential manager).
function gitPushCmd() {
  if (!GITHUB_REPO) throw new Error('GITHUB_REPO is not set in .env — cannot push. Add GITHUB_REPO=owner/repo to your .env file.');
  if (GITHUB_TOKEN) {
    const [owner] = GITHUB_REPO.split('/');
    return `git push https://${owner}:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git HEAD:main`;
  }
  return `git push https://github.com/${GITHUB_REPO}.git HEAD:main`;
}

// ── Data API ───────────────────────────────────────────────────

// GET /api/data — read full data.json
app.get('/api/data', (req, res) => {
  const data = readData();
  if (!data) return res.status(404).json({ error: 'data.json not found. Run the migration first.' });
  res.json(data);
});

// PUT /api/data — write full data.json
app.put('/api/data', (req, res) => {
  try {
    writeData(req.body);
    res.json({ ok: true, savedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// PATCH /api/data/taxa — upsert a single taxon
app.patch('/api/data/taxa', (req, res) => {
  try {
    const data  = readData();
    const taxon = req.body;
    if (!taxon || !taxon.id) return res.status(400).json({ error: 'taxon.id required' });
    const idx = data.taxa.findIndex(t => t.id === taxon.id);
    if (idx >= 0) data.taxa[idx] = taxon;
    else data.taxa.push(taxon);
    writeData(data);
    res.json({ ok: true, taxon });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE /api/data/taxa/:id — remove a taxon
app.delete('/api/data/taxa/:id', (req, res) => {
  try {
    const data = readData();
    data.taxa  = data.taxa.filter(t => t.id !== req.params.id);
    writeData(data);
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Git / Publish ──────────────────────────────────────────────

// GET /api/git/status — last commit + dirty flag
app.get('/api/git/status', (req, res) => {
  try {
    const lastCommit = runGit('git log -1 --format="%h %s (%cr)"');
    const dirty      = runGit('git status --porcelain');
    const branch     = runGit('git rev-parse --abbrev-ref HEAD');
    res.json({ lastCommit, dirty: dirty.length > 0, branch, dirtyFiles: dirty });
  } catch (e) {
    res.json({ lastCommit: 'No commits yet', dirty: false, branch: 'main', error: e.message });
  }
});

// POST /api/publish — commit data.json + push
app.post('/api/publish', (req, res) => {
  const { message } = req.body || {};
  try {
    const data  = readData();
    const count = data?.taxa?.length ?? '?';
    const msg   = (message || `Published: ${count} taxa · ${new Date().toISOString().slice(0,10)}`).replace(/"/g, "'");

    runGit('git add data/data.json');
    const staged = runGit('git diff --cached --name-only');
    if (!staged) {
      return res.json({ ok: true, noChanges: true });
    }

    runGit(`git commit -m "${msg}"`);

    // Build push command first — throws a friendly error if GITHUB_REPO not set
    const pushCmd = gitPushCmd();
    runGit(pushCmd);

    res.json({ ok: true, message: msg, pushedAt: new Date().toISOString() });
  } catch (e) {
    // execSync throws with stderr in e.message; extract the useful part
    const raw = (e.stderr || e.message || String(e)).toString();
    const friendly = raw.split('\n').filter(l => l.trim() && !l.startsWith('hint:')).join(' ').slice(0, 300);
    res.status(500).json({ error: friendly || e.message });
  }
});

// ── Google Drive (OAuth2 Desktop flow) ─────────────────────────

const { google }  = require('googleapis');
const TOKEN_FILE  = path.join(__dirname, 'credentials', 'token.json');

let driveClient = null;

// Find the client_secret*.json file the user dropped in credentials/
function findClientSecretFile() {
  try {
    const dir = path.join(__dirname, 'credentials');
    const match = fs.readdirSync(dir).find(f => f.startsWith('client_secret') && f.endsWith('.json'));
    return match ? path.join(dir, match) : null;
  } catch (e) { return null; }
}

function getOAuthClient() {
  const secretFile = findClientSecretFile();
  if (!secretFile) return null;
  try {
    const raw    = JSON.parse(fs.readFileSync(secretFile, 'utf8'));
    const creds  = raw.installed || raw.web;
    return new google.auth.OAuth2(
      creds.client_id,
      creds.client_secret,
      `http://localhost:${PORT}/auth/callback`
    );
  } catch (e) {
    console.error('OAuth client init error:', e.message);
    return null;
  }
}

function getDrive() {
  if (driveClient) return driveClient;
  if (!fs.existsSync(TOKEN_FILE)) return null;
  try {
    const oAuth2Client = getOAuthClient();
    if (!oAuth2Client) return null;
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oAuth2Client.setCredentials(token);
    // Persist refreshed tokens automatically
    oAuth2Client.on('tokens', tokens => {
      const saved = fs.existsSync(TOKEN_FILE) ? JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8')) : {};
      fs.writeFileSync(TOKEN_FILE, JSON.stringify({ ...saved, ...tokens }, null, 2));
    });
    driveClient = google.drive({ version: 'v3', auth: oAuth2Client });
    return driveClient;
  } catch (e) {
    console.error('Drive init error:', e.message);
    return null;
  }
}

// GET /auth/google — kick off the OAuth consent screen
app.get('/auth/google', (req, res) => {
  const client = getOAuthClient();
  if (!client) return res.status(503).send('<h2>No client_secret.json found in credentials/</h2>');
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive.readonly'],
    prompt: 'consent'   // force refresh_token to be returned every time
  });
  res.redirect(url);
});

// GET /auth/callback — Google redirects here after user approves
app.get('/auth/callback', async (req, res) => {
  const { code, error } = req.query;
  if (error) return res.send(`<h2 style="font-family:sans-serif;color:red">Auth failed: ${error}</h2>`);
  try {
    const client = getOAuthClient();
    const { tokens } = await client.getToken(code);
    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2));
    driveClient = null;  // reset so next call re-initialises with new token
    res.send(`
      <html><body style="font-family:sans-serif;padding:40px;background:#1a1a1a;color:#fff">
        <h2 style="color:#c9a84c">✓ Google Drive connected!</h2>
        <p>You can close this tab and return to the admin.</p>
        <script>setTimeout(()=>window.close(), 2500)</script>
      </body></html>
    `);
  } catch (e) {
    res.status(500).send(`<h2 style="font-family:sans-serif;color:red">Token error: ${e.message}</h2>`);
  }
});

// GET /api/drive/auth-status — is Drive connected?
app.get('/api/drive/auth-status', (req, res) => {
  const hasSecret  = !!findClientSecretFile();
  const hasToken   = fs.existsSync(TOKEN_FILE);
  res.json({ hasSecret, hasToken, connected: hasSecret && hasToken });
});

// POST /api/drive/disconnect — revoke stored token
app.post('/api/drive/disconnect', (req, res) => {
  if (fs.existsSync(TOKEN_FILE)) fs.unlinkSync(TOKEN_FILE);
  driveClient = null;
  res.json({ ok: true });
});

// POST /api/drive/scan — recursively scan a folder and return structure
// Body: { folderId }
app.post('/api/drive/scan', async (req, res) => {
  const drive = getDrive();
  if (!drive) return res.status(503).json({ error: 'Google Drive not connected. Click "Connect Drive" in Settings.' });
  try {
    const { folderId } = req.body || {};

    async function listFolder(id, depth = 0) {
      const q = id
        ? `'${id}' in parents and trashed = false`
        : `'root' in parents and trashed = false and mimeType = 'application/vnd.google-apps.folder'`;
      const resp = await drive.files.list({
        q,
        fields: 'files(id, name, mimeType)',
        pageSize: 200,
        orderBy: 'name'
      });
      const files = resp.data.files || [];
      const result = [];
      for (const f of files) {
        const node = { id: f.id, name: f.name, type: f.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file' };
        if (node.type === 'folder' && depth < 3) node.children = await listFolder(f.id, depth + 1);
        result.push(node);
      }
      return result;
    }

    const tree = await listFolder(folderId || null);
    res.json({ ok: true, tree });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/drive/files/:folderId — list files in a folder (shallow)
app.get('/api/drive/files/:folderId', async (req, res) => {
  const drive = getDrive();
  if (!drive) return res.status(503).json({ error: 'Drive not connected.' });
  try {
    const resp = await drive.files.list({
      q: `'${req.params.folderId}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
      fields: 'files(id, name, mimeType, thumbnailLink)',
      pageSize: 200,
      orderBy: 'name'
    });
    res.json({ ok: true, files: resp.data.files || [] });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── AI Research ────────────────────────────────────────────────

// POST /api/ai/research — proxy to Anthropic API
app.post('/api/ai/research', async (req, res) => {
  if (!ANTHROPIC_KEY) return res.status(503).json({ error: 'ANTHROPIC_API_KEY not set in .env' });
  try {
    const fetch = (await import('node-fetch')).default;
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':            'application/json',
        'x-api-key':               ANTHROPIC_KEY,
        'anthropic-version':       '2023-06-01',
        'anthropic-beta':          'interleaved-thinking-2025-05-14'
      },
      body: JSON.stringify(req.body)
    });
    const data = await upstream.json();
    res.status(upstream.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── External Site Indexing ─────────────────────────────────────

// POST /api/index/cppf — scrape a CPPF genus directory page
// Body: { genus }  e.g. "Drosera"
app.post('/api/index/cppf', async (req, res) => {
  const { genus } = req.body || {};
  if (!genus) return res.status(400).json({ error: 'genus required' });
  try {
    const fetch    = (await import('node-fetch')).default;
    const url      = `https://cpphotofinder.com/${genus}.html`;
    const html     = await (await fetch(url)).text();

    // Extract links: <a href="/drosera-capensis-522.html">Drosera capensis</a>
    const entries = [];
    const linkRe  = /href="(\/[a-z0-9\-]+\.html)"[^>]*>([^<]+)</gi;
    let m;
    while ((m = linkRe.exec(html)) !== null) {
      const href = m[1];
      const name = m[2].replace(/\s+/g, ' ').trim();
      if (name && href && !href.includes('index') && !href.includes('search')) {
        entries.push({ name, url: 'https://cpphotofinder.com' + href });
      }
    }

    res.json({ ok: true, genus, count: entries.length, entries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/index/fierceflora — scrape FF category pages for a genus (all pages)
// Body: { genus }  e.g. "drosera"
app.post('/api/index/fierceflora', async (req, res) => {
  const { genus } = req.body || {};
  if (!genus) return res.status(400).json({ error: 'genus required' });
  try {
    const fetch   = (await import('node-fetch')).default;
    const entries = [];
    let page = 1, maxPages = 30;

    while (page <= maxPages) {
      const url  = page === 1
        ? `https://www.fierceflora.com/category/plants/${genus.toLowerCase()}/`
        : `https://www.fierceflora.com/category/plants/${genus.toLowerCase()}/page/${page}/`;
      const resp = await fetch(url);
      if (!resp.ok) break;
      const html = await resp.text();

      // Extract pagination count on first page
      if (page === 1) {
        const pgMatch = html.match(/Page \d+ of (\d+)/i);
        if (pgMatch) maxPages = Math.min(parseInt(pgMatch[1]), 30);
      }

      // Extract article title + link
      const artRe = /<h\d[^>]*>\s*<a\s+href="(https:\/\/www\.fierceflora\.com\/[^"]+)"[^>]*>([^<]+)<\/a>/gi;
      let m;
      while ((m = artRe.exec(html)) !== null) {
        const url2 = m[1].trim();
        const title = m[2].replace(/\s+/g, ' ').trim();
        if (title && url2 && !entries.find(e => e.url === url2)) {
          entries.push({ title, url: url2 });
        }
      }

      // Stop if "next page" link absent
      if (!html.includes('class="next')) break;
      page++;
    }

    res.json({ ok: true, genus, pagesFetched: page - 1, count: entries.length, entries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/index/icps — scrape ICPS taxonomy pages for a group
// Body: { group, groupSlug, pages }
// e.g. { group: "Pygmy", groupSlug: "PygmyDrosera", pages: ["pg1","pg2","pg3","pg4"] }
app.post('/api/index/icps', async (req, res) => {
  const { group, groupSlug, pages = [] } = req.body || {};
  if (!groupSlug) return res.status(400).json({ error: 'groupSlug required' });
  try {
    const fetch   = (await import('node-fetch')).default;
    const entries = [];
    const base    = 'https://www.carnivorousplants.org/cp/taxonomy';

    for (const pg of pages) {
      const url  = `${base}/${groupSlug}/${pg}`;
      const html = await (await fetch(url)).text();

      // Extract anchor IDs: id="Droseraalbonotata" near species names
      const anchorRe = /id="(Drosera[A-Za-z]+)"[^>]*>[\s\S]*?<em[^>]*>(Drosera [^<]+)<\/em>/gi;
      let m;
      while ((m = anchorRe.exec(html)) !== null) {
        const anchor  = '#' + m[1];
        const name    = m[2].replace(/\s+/g, ' ').trim();
        if (name && !entries.find(e => e.name === name)) {
          entries.push({ name, anchor, page: pg, url: `${url}${anchor}` });
        }
      }

      // Fallback: extract species names from headings if anchor pattern not found
      if (!entries.length) {
        const headRe = /<h[23][^>]*id="([^"]+)"[^>]*>([^<]+)</gi;
        while ((m = headRe.exec(html)) !== null) {
          const anchor = '#' + m[1];
          const name   = m[2].replace(/\s+/g, ' ').trim();
          if (name.match(/^[A-Z][a-z]+ [a-z]/)) {
            entries.push({ name, anchor, page: pg, url: `${url}${anchor}` });
          }
        }
      }
    }

    res.json({ ok: true, group, count: entries.length, entries });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── Config endpoint ────────────────────────────────────────────

// GET /api/config — return non-secret server config to admin UI
app.get('/api/config', (req, res) => {
  const hasSecret  = !!findClientSecretFile();
  const hasToken   = fs.existsSync(TOKEN_FILE);
  res.json({
    driveReady:      hasSecret && hasToken,
    driveHasSecret:  hasSecret,
    driveHasToken:   hasToken,
    driveAuthUrl:    '/auth/google',
    githubRepo:      GITHUB_REPO,
    hasAnthropicKey: !!ANTHROPIC_KEY,
    hasGithubToken:  !!GITHUB_TOKEN,
    dataFile:        DATA_FILE,
    rawDataUrl:      GITHUB_REPO
      ? `https://raw.githubusercontent.com/${GITHUB_REPO}/main/data/data.json`
      : null
  });
});

// ── Start ──────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║   Bogman Gallery Admin — v2.0        ║');
  console.log(`  ║   http://localhost:${PORT}              ║`);
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');
  if (!findClientSecretFile()) {
    console.log('  ⚠  Google Drive: no client_secret.json found in credentials/');
    console.log('');
  } else if (!fs.existsSync(TOKEN_FILE)) {
    console.log('  ℹ  Google Drive: client secret found but not yet connected.');
    console.log(`     Open http://localhost:${PORT}/auth/google to connect.`);
    console.log('');
  } else {
    console.log('  ✓  Google Drive connected.');
    console.log('');
  }
  if (!ANTHROPIC_KEY) {
    console.log('  ⚠  ANTHROPIC_API_KEY not set in .env');
    console.log('');
  }
  if (!GITHUB_TOKEN) {
    console.log('  ⚠  GITHUB_TOKEN not set in .env');
    console.log('     Publish will fall back to system credential manager.');
    console.log('     Get a token at: https://github.com/settings/tokens/new');
    console.log('');
  }
});
