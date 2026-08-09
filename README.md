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
| `npm run deploy` | Build, upload assets first, verify them, then publish HTML (NAS over SSH) |
| `npm run smoke:deeplinks` | Verify production bundles, assets, and deep links |
| `npm run verify:production` | Compare the live release with the local `dist/` build |
| `npm run test:deploy` | Prove interrupted asset uploads preserve the live release |
| `npm run icons` | Regenerate favicon PNGs and `site.webmanifest` from `public/favicon.svg` |
| `npm run images` | Regenerate responsive WebP assets with Sharp |
| `npm run check:size` | Verify production JavaScript, CSS, and image budgets |

**Make shortcuts** (same behavior):

```bash
make dev
make build
make deploy          # uses .deploy-env NAS SSH settings; see below
make smoke           # defaults to https://ssatcy.com
```

## Deploy (NAS SSH)

1. Copy `.deploy-env.example` → `.deploy-env` and confirm the
   `dev@gorfednas:/volume1/data/websites/ssatcy.com` target (or run
   `gorfednet.github/scripts/setup-nas-ssh.sh` once).

2. Deploy:

   ```bash
   make deploy
   ```

`deploy` is intentionally non-destructive. It uploads hashed assets without
deleting the previous release, verifies every new asset through the production
origin, and publishes HTML last. A stalled SSH transfer therefore leaves the
currently published release intact. Previous hashed assets remain available for
open browser sessions and can be pruned separately after they age out.

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
│   ├── deploy-ssh.sh         # Asset-first guarded NAS SSH deployment
│   ├── optimize-images.mjs   # Responsive image generator
│   ├── test-deploy-safety.sh # Interrupted-deployment regression test
│   ├── verify-production.mjs # Live bundle, asset, and route verification
│   └── smoke-deeplinks.sh    # Compatibility wrapper for live verification
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
