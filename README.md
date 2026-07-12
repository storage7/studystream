# 🎓 StudyStream — Premium Private Video Streaming Platform

A modern, Netflix-inspired private study video streaming platform built with React, Tailwind CSS, and Cloudflare Workers.

![StudyStream](https://img.shields.io/badge/StudyStream-Premium-6366f1?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Tailwind](https://img.shields.io/badge/Tailwind-4-06B6D4?style=flat-square&logo=tailwindcss)
![Cloudflare](https://img.shields.io/badge/Cloudflare-Workers-F38020?style=flat-square&logo=cloudflare)

---

## ✨ Features

### Authentication & Security
- 🔐 Mobile number + password login (no signup/registration)
- 🔑 Bcrypt password hashing
- 🎫 JWT-based authentication
- 🚫 Failed login → instant redirect to Google (no error messages)
- 🛡️ All sensitive data stored in Cloudflare KV (never in the repo)
- 🔒 Protected routes require valid JWT

### User Roles
- **Admin**: Full access, no watermark on videos
- **Guest**: Full access, floating watermark (name + mobile) over video
  - Watermark moves randomly every 8–12 seconds with low opacity

### Video Streaming
- 🎬 Multiple embed servers per lecture
- 🔄 Clean server selector (switch without page reload)
- ▶️ Previous / Next navigation
- 📋 Playlist panel with progress indicators
- 🔁 Auto-next lecture toggle
- 🖥️ Fullscreen support
- ⏳ Loading animation

### Dashboard
- 👋 Personalized welcome message with greeting
- 🔍 Instant search across batches, subjects, and lectures
- 📁 Sidebar with unlimited Batches → Subjects → Lectures
- ⏯️ Continue Watching section
- 🕐 Recently Watched section
- 📊 Quick stats (batches, lectures, completed)

### Local Storage
- 📍 Playback progress tracking
- 📺 Last watched lecture
- 🎛️ Selected server per lecture
- 📝 Watch history (last 50 entries)
- ⏭️ Auto-next preference

### Design
- 🌙 Premium dark theme
- 🪟 Glassmorphism effects
- ✨ Smooth animations & transitions
- 🎨 Gradient text & glow effects
- 📱 Fully responsive (mobile, tablet, desktop)
- 💀 Skeleton loaders
- 🔔 Toast notifications
- 🎯 Modern Lucide icons
- 📜 Custom scrollbar

---

## 📁 Project Structure

```
studystream/
├── src/                        # Frontend source
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx
│   │   │   ├── Header.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── player/
│   │   │   ├── VideoPlayer.tsx
│   │   │   ├── VideoWatermark.tsx
│   │   │   ├── ServerSelector.tsx
│   │   │   └── PlaylistPanel.tsx
│   │   └── ui/
│   │       ├── LoadingSpinner.tsx
│   │       ├── Skeleton.tsx
│   │       └── ToastContainer.tsx
│   ├── config/
│   │   └── api.ts
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── PlayerContext.tsx
│   │   └── ToastContext.tsx
│   ├── hooks/
│   │   ├── useBatches.ts
│   │   └── useSearch.ts
│   ├── pages/
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   └── WatchPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── api.ts
│   │   ├── cn.ts
│   │   └── storage.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── cloudflare-worker/          # Backend source
│   ├── worker.js
│   ├── wrangler.toml
│   ├── generate-hash.js
│   ├── setup-kv.sh
│   └── sample-data/
│       ├── users.json
│       └── lectures.json
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🚀 Deployment Guide

### Prerequisites
- Node.js 18+
- npm or yarn
- Cloudflare account (free tier works)
- GitHub account

---

### Step 1: Set Up Cloudflare Worker Backend

#### 1.1 Install Wrangler CLI
```bash
npm install -g wrangler
wrangler login
```

#### 1.2 Create KV Namespace
```bash
cd cloudflare-worker
wrangler kv:namespace create "STUDYSTREAM_KV"
```
Copy the output namespace ID and update `wrangler.toml`:
```toml
[[kv_namespaces]]
binding = "STUDYSTREAM_KV"
id = "paste-your-namespace-id-here"
```

#### 1.3 Generate Password Hashes
```bash
npm install bcryptjs
node generate-hash.js "YourAdminPassword"
node generate-hash.js "YourGuestPassword"
```

#### 1.4 Prepare Data Files

Edit `sample-data/users.json`:
```json
[
  {
    "id": "user_admin_001",
    "name": "Admin Name",
    "mobile": "9999999999",
    "role": "admin",
    "passwordHash": "$2a$10$... (paste your bcrypt hash)"
  },
  {
    "id": "user_guest_001",
    "name": "Student Name",
    "mobile": "9876543210",
    "role": "guest",
    "passwordHash": "$2a$10$... (paste your bcrypt hash)"
  }
]
```

Edit `sample-data/lectures.json` with your actual lecture data and embed URLs.

#### 1.5 Upload Data to KV
```bash
KV_ID="your-namespace-id"
wrangler kv:key put --namespace-id="$KV_ID" "users" --path="sample-data/users.json"
wrangler kv:key put --namespace-id="$KV_ID" "lectures" --path="sample-data/lectures.json"
```

#### 1.6 Set JWT Secret
```bash
wrangler secret put JWT_SECRET
# Enter a strong random secret (32+ characters)
```

#### 1.7 Deploy Worker
```bash
wrangler deploy
```

Note your worker URL (e.g., `https://studystream-api.your-subdomain.workers.dev`)

---

### Step 2: Deploy Frontend to GitHub Pages

#### 2.1 Configure API URL

Create `.env` in the project root:
```
VITE_API_URL=https://studystream-api.your-subdomain.workers.dev
```

Or update `src/config/api.ts` directly with your worker URL.

#### 2.2 Build the Frontend
```bash
npm install
npm run build
```

#### 2.3 Deploy to GitHub Pages

**Option A: Manual Deploy**
```bash
# Push dist/ contents to gh-pages branch
git subtree push --prefix dist origin gh-pages
```

**Option B: GitHub Actions (Recommended)**

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci

      - run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Add `VITE_API_URL` as a GitHub repository secret.

#### 2.4 Enable GitHub Pages
1. Go to Repository → Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `gh-pages` / `/ (root)`
4. Save

---

## 🔧 Environment Variables

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Cloudflare Worker URL | `https://studystream-api.xxx.workers.dev` |

### Cloudflare Worker (Secrets)
| Variable | Description | How to Set |
|----------|-------------|------------|
| `JWT_SECRET` | JWT signing secret | `wrangler secret put JWT_SECRET` |

### Cloudflare Worker (KV Data)
| Key | Description | Format |
|-----|-------------|--------|
| `users` | User accounts | JSON array (see sample) |
| `lectures` | Lecture catalog | JSON object (see sample) |

---

## 📝 Managing Data

### Adding/Editing Users
1. Generate bcrypt hash: `node cloudflare-worker/generate-hash.js "NewPassword"`
2. Edit your local `users.json`
3. Upload to KV:
```bash
wrangler kv:key put --namespace-id="$KV_ID" "users" --path="users.json"
```

### Adding/Editing Lectures
1. Edit your local `lectures.json`
2. Upload to KV:
```bash
wrangler kv:key put --namespace-id="$KV_ID" "lectures" --path="lectures.json"
```

### Data Format for lectures.json
```json
{
  "batches": [
    {
      "id": "unique-batch-id",
      "name": "Batch Name",
      "description": "Optional description",
      "subjects": [
        {
          "id": "unique-subject-id",
          "name": "Subject Name",
          "lectures": [
            {
              "id": "unique-lecture-id",
              "title": "Lecture Title",
              "description": "Optional description",
              "duration": "45:30",
              "order": 1,
              "servers": [
                {
                  "id": "server-1",
                  "name": "Server 1 (HD)",
                  "embedUrl": "https://your-video-host.com/embed/VIDEO_ID"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

---

## 🔒 Security Highlights

1. **No secrets in repository** — All sensitive data lives in Cloudflare KV/Secrets
2. **Bcrypt passwords** — Passwords stored as bcrypt hashes only
3. **JWT authentication** — Stateless, signed tokens with expiration
4. **Embed URL protection** — Video URLs only served via authenticated API calls
5. **No registration** — Users manually provisioned by admin
6. **Failed login redirect** — No information leakage on failed attempts
7. **CORS configured** — Worker handles cross-origin requests properly

---

## 📄 License

Private and proprietary. Not for redistribution.
