# Bogman Gallery v2

A self-hosted carnivorous plant photo gallery system with a local admin app, GitHub-backed data, and a Squarespace-embedded public gallery.

---

## Architecture

```
Squarespace page
  └── Code block: <div id="bmg-root"> + gallery.js via jsDelivr CDN
        └── Fetches data.json from raw.githubusercontent.com
              ↑ committed by the admin app on Publish

Local admin app (localhost:3001)
  ├── server.js  (Express — file I/O, git, Drive API, AI proxy)
  ├── admin/index.html  (single-page admin UI)
  └── data/data.json  (source of truth)
```

---

## First-Time Setup

### 1. GitHub Repository

1. Create a new public GitHub repo (e.g. `bogmangallery`)
2. Run in this folder:
   ```bash
   git init
   git remote add origin https://github.com/bogmanplantenstein/bogmangallery.git
   git add .
   git commit -m "Initial v2 setup"
   git push -u origin main
   ```

### 2. Environment Variables

Create `.env` in this folder:
```
GITHUB_REPO=bogmanplantenstein/bogmangallery
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Google Drive (optional)

To use Google Drive photo browsing in the admin:

1. Create a Google Cloud project at [console.cloud.google.com](https://console.cloud.google.com)
2. Enable the **Google Drive API**
3. Create a **Service Account** and download the JSON key
4. Place the key at `credentials/service-account.json`
5. Share your Bogman Photos folder with the service account email (Viewer access)
6. On all photo files: Share → "Anyone with the link" → Viewer

### 5. Squarespace

1. Open `squarespace-snippet.html` and copy the two-line code block
2. Replace `bogmanplantenstein` with your GitHub username
3. In Squarespace: add a **Code Block** to your gallery page and paste
4. Save — done. This never changes again.

### 6. Migrate from v1 (if applicable)

1. Open `scripts/migrate.html` in the **same browser** you used to run the old admin
2. Follow the 3-step wizard to detect, convert, and download `data.json`
3. Place the downloaded file at `data/data.json`

---

## Running the Admin

**Windows:** Double-click `start-admin.bat`

**Manual:**
```bash
node server.js
```
Then open [http://localhost:3001](http://localhost:3001)

---

## Daily Workflow

1. Open the admin app (`start-admin.bat`)
2. Add/edit taxa — photos, care info, external links
3. Click **Publish** when ready to go live
   - Commits `data/data.json` to git and pushes to GitHub
   - Gallery updates within seconds (no Squarespace changes needed)

---

## Photo URL Format

Photos are stored with a source prefix:

| Format | Example | Resolves to |
|--------|---------|-------------|
| `sq:https://images.squarespace-cdn.com/...` | Squarespace CDN | Direct URL |
| `drive:FILE_ID` | Google Drive file | `lh3.googleusercontent.com/d/FILE_ID` |

---

## File Structure

```
v2/
├── admin/
│   └── index.html          ← admin single-page app
├── credentials/
│   ├── README.txt          ← setup instructions
│   └── service-account.json  ← NOT committed (gitignored)
├── data/
│   └── data.json           ← all taxa, care, links (committed on Publish)
├── scripts/
│   └── migrate.html        ← one-time v1→v2 migration tool
├── .env                    ← NOT committed (gitignored)
├── .gitignore
├── gallery.js              ← public gallery script (auto-loaded by jsDelivr)
├── package.json
├── README.md
├── server.js               ← Express admin server
├── squarespace-snippet.html  ← paste this into Squarespace once
└── start-admin.bat         ← Windows launcher
```

---

## data.json Schema (key fields)

```json
{
  "meta": { "version": "2.0", "taxaCount": 0, "githubRepo": "user/repo" },
  "taxa": [
    {
      "id": "drosera_capensis_abc1",
      "genus": "Drosera",
      "species": "capensis",
      "displayName": "Drosera capensis",
      "entryType": "species",
      "group": "Subtropical",
      "photos": [
        { "src": "sq:https://images.squarespace-cdn.com/...", "caption": "", "primary": true }
      ],
      "care": {
        "override": true,
        "light": "Full sun to bright indirect",
        "water": "Tray method, 1–2cm of water",
        "soil": "1:1 peat:perlite or pure live sphagnum"
      },
      "extLinks": {
        "cppf": "https://cpphotofinder.com/drosera-capensis-522.html",
        "fierceflora": "https://www.fierceflora.com/drosera-capensis/",
        "icps": "https://www.carnivorousplants.org/cp/taxonomy/subtropicalDrosera"
      }
    }
  ],
  "groupCareDefaults": {
    "Subtropical": { "light": "...", "water": "...", "soil": "..." }
  }
}
```

---

## Troubleshooting

**Gallery shows "Loading…" forever**
- Check that `data.json` exists and is valid JSON
- Check that GitHub repo is public and the push succeeded
- Verify the jsDelivr URL in the Squarespace snippet matches your GitHub username/repo

**Admin can't connect to server**
- Make sure `node server.js` is running (or use `start-admin.bat`)
- Check that nothing else is on port 3001

**Drive scanning fails**
- Confirm `credentials/service-account.json` is present and valid
- Confirm the service account has been shared on the Drive folder
- Check the Drive API is enabled in Google Cloud Console

**Git push fails on Publish**
- Ensure git is installed and the remote is configured: `git remote -v`
- If using HTTPS, you may need a GitHub personal access token in your git credential store
