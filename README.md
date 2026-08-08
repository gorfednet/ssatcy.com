# ssatcy.com

Official website for **SSATCY** (Sunshine Sneeze and the Contagious Yawn) — a Toronto-based musical project spanning discography, film scoring, game soundtracks, live events, and a visual archive.

**Live site:** [https://ssatcy.com](https://ssatcy.com)

## Stack

| Layer | Choice |
|-------|--------|
| UI | React 18 + TypeScript (TSX) |
| Build | [Vite](https://vite.dev/) 8 |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Motion | [Motion](https://motion.dev/) |
| Deploy | Static `dist/` (Apache `.htaccess` + optional Netlify-style `_headers`) |

The app is a **single-page site** with section scrolling and path-based deep links (`/bio`, `/film`, `/gallery`, etc.). `postbuild` duplicates `index.html` into per-route folders so static hosts serve the SPA entry without extra server config.

## Prerequisites

- Node.js 20.19+ or 22.12+
- npm

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Local development server with HMR |
| `npm run build` | Production build → `dist/` |
| `npm run deploy:smb` | Build, then `rsync` `dist/` to `$SMB_DEPLOY_TARGET` |
| `npm run smoke:deeplinks` | HTTP 200 check for `/`, `/bio`, … `/contact` |
| `npm run icons` | Regenerate favicon PNGs and `site.webmanifest` from `public/favicon.svg` |
| `npm run images` | Regenerate responsive WebP assets with Sharp |
| `npm run check:size` | Verify production JavaScript, CSS, and image budgets |

**Make shortcuts** (same behavior):

```bash
make dev
make build
make deploy          # uses SMB_DEPLOY_TARGET; see below
make smoke           # defaults to https://ssatcy.com
```

## Deploy (SMB / static host)

1. Mount or sync your web root (example on macOS):

   `/Volumes/data/websites/ssatcy.com`

2. Set the target and deploy:

   ```bash
   export SMB_DEPLOY_TARGET="/Volumes/data/websites/ssatcy.com"
   npm run deploy:smb
   ```

   Or copy `.env.example` → `.env` and set `SMB_DEPLOY_TARGET`, then:

   ```bash
   make deploy
   ```

`deploy:smb` runs `rsync -av --delete dist/` so removed hashed assets are pruned on the server.

## Project layout

```
├── index.html          # Shell, SEO / Open Graph meta, CSP
├── public/             # Static files copied to dist root (og-image, favicon suite, manifest)
│   ├── favicon.svg     # Master icon (edit this, then run `npm run icons`)
│   ├── favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, …
│   └── site.webmanifest
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx           # Navigation and routing via pathname
│   │   ├── content.ts        # Nav, events, gallery, feature image imports
│   │   ├── sections/         # Static page sections
│   │   └── components/       # Shared UI (SectionIntro, cards, etc.)
│   ├── assets/images/
│   │   └── generated/        # Responsive WebP variants
│   └── styles/               # Global CSS, Tailwind entry
├── scripts/
│   ├── check-build-size.mjs  # Production asset budgets
│   ├── optimize-images.mjs   # Responsive image generator
│   └── smoke-deeplinks.sh    # Post-deploy HTTP smoke test
├── _headers                # Security / cache headers (copied to dist)
├── .htaccess               # Apache SPA fallback + headers (copied to dist)
└── site-copy.txt           # Copy deck reference (not loaded at runtime)
```

## Content updates

| What you change | Where |
|-----------------|--------|
| Nav, events, gallery alts, image imports | `src/app/content.ts` |
| Section body copy, hero, footer | `src/app/sections/*.tsx` |
| Page title, meta description, OG/Twitter | `index.html` |
| Draft / long-form copy notes | `site-copy.txt` (manual sync to code) |

## Security notes

- Response headers and CSP are defined in `_headers`, `.htaccess`, and a fallback `<meta http-equiv="Content-Security-Policy">` in `index.html`.
- Outbound links use `rel="noopener noreferrer"` via `ExternalSiteLink`.
- Contact email is revealed on user interaction (not embedded in static HTML).

This is standard front-end hardening, not a guarantee against all abuse.

## Repository

- **GitHub:** [github.com/gorfednet/ssatcy.com](https://github.com/gorfednet/ssatcy.com)

## License

© SSATCY. Site content and assets are proprietary unless otherwise noted. Source in this repository is for project maintenance by the rights holders.
