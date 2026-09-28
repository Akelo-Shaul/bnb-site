# Setup, running & deployment

## Prerequisites

Node.js 20.9+ (the project was set up with Node 24 LTS). On this machine Node is installed through **nvm** for the current user:

```bash
# new terminals load nvm automatically; in an existing one:
source ~/.nvm/nvm.sh
node -v   # v24.x
```

## Local development

```bash
cd ~/Downloads/BnbFiles/code
cp .env.example .env.local   # then edit the values
npm install                  # only needed after a fresh clone
npm run dev                  # http://localhost:3000 (hot reload)
```

Useful scripts:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build (type-checks and prerenders every page) |
| `npm run start` | Serve the production build (after `build`) |
| `npm run lint` | ESLint |

## Environment variables

See `.env.example` and `docs/content-guide.md`. All are `NEXT_PUBLIC_*`, so they're embedded at **build time**: rebuild or redeploy after changing them.

## Deployment

**Vercel (recommended):** import the project, add the `NEXT_PUBLIC_*` variables under *Settings → Environment Variables*, and deploy. No other config is needed.

**Any Node host:** `npm run build && npm run start` (port 3000 by default; `-p` to change).

**Pure static hosting** (Netlify drop, GitHub Pages, cPanel): add `output: "export"` and `images: { unoptimized: true }` to `next.config.ts`, then `npm run build` and upload the generated `out/` folder. Every page is already static, so nothing else needs to change.
