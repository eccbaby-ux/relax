# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts both Vite on :5173 and Express API on :3001 concurrently)
npm run dev

# Build for production
npm run build

# Run API server only (production mode)
npm run start
```

## Architecture

Hebrew RTL web app for special education students. Two separate entry points:

- **`server.js`** — Local dev Express server (port 3001), uses `dotenv` for env vars
- **`api/index.js`** — Vercel serverless function (same routes, no `app.listen`, exports `default app`)

Vite proxies `/api/*` → `localhost:3001` in dev (`vite.config.js`). On Vercel, `vercel.json` rewrites `/api/*` → `/api/index`.

### Data layer

All content is stored in **Supabase** (PostgreSQL). Table: `items` with columns `id, category, title, description, link, image, emoji`. Both `server.js` and `api/index.js` use `@supabase/supabase-js` with the service role key (server-side only).

`public/data.json` still exists as a local fallback but is no longer the source of truth.

The `/api/categories` endpoint merges a hardcoded `DEFAULT_CATEGORIES` array with any categories found in the items table, so the admin dropdown always shows all categories even when the table is empty.

### Image uploads

Images upload directly from the browser to **Supabase Storage** (bucket: `images`, public). `src/supabaseClient.js` creates a client using `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (exposed to frontend). The resulting public URL is saved as `item.image`.

### Auth

`POST /api/login` checks `ADMIN_PASSWORD` env var and returns a static token stored in `localStorage`. All mutating API routes require `Authorization: Bearer <token>`. No expiry.

### Routing

- `/` — Public main app
- `/admin` — Admin panel, gated by `useAdmin` hook (checks localStorage token)

The 🔐 button in `Header.jsx` navigates to `/admin`.

### Key gotcha: categories sync

`BottomNav.jsx` and `Sidebar.jsx` each have a hardcoded `CATEGORIES` array for display. `DEFAULT_CATEGORIES` in both `server.js` and `api/index.js` must match these. When adding a new default category, update all three places.

### Environment variables

| Variable | Used by |
|---|---|
| `SUPABASE_URL` | server.js, api/index.js |
| `SUPABASE_SERVICE_KEY` | server.js, api/index.js |
| `ADMIN_PASSWORD` | server.js, api/index.js |
| `VITE_SUPABASE_URL` | Frontend (Supabase Storage uploads) |
| `VITE_SUPABASE_ANON_KEY` | Frontend (Supabase Storage uploads) |
