<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project notes

- Read `docs/project-status.md` first (current state, decisions, placeholder checklist, next steps). Keep it, `CHANGELOG.md` and `docs/animations.md` updated when you change things.

- Site for a single owner's short-stay rentals; bookings happen off-site via WhatsApp/Instagram (`src/lib/contact.ts`). No payments or availability backend.
- Listing content lives in `src/data/properties.ts` (currently placeholder data); business/contact settings in `src/data/site.ts` + `NEXT_PUBLIC_*` env vars.
- Design source: Figma file key `LNP8wl0waVCUnO6sGu4FKh` (home `1:1886`, listing `7:2044`). Tokens are in `src/app/globals.css`.
- Animations: GSAP via `src/lib/gsap.ts`; follow `docs/animations.md`.
- Never compute "today" during render on the server; use `useToday()` (pages are statically generated).
- Figma connector account is on the Starter plan (~20 MCP calls/month): fetch sparingly.
