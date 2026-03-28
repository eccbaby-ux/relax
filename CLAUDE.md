# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (starts both Vite on :5173 and Express API on :3001)
npm run dev

# Build for production
npm run build

# Run API server only
npm run server
```

## Architecture

This is a full-stack Hebrew RTL web app for special education students ("Relax App"). Two processes run concurrently via `concurrently`:

- **Vite dev server** (port 5173) — React frontend
- **Express server** (`server.js`, port 3001) — REST API that reads/writes `public/data.json`

In dev, Vite proxies `/api/*` to `localhost:3001` (configured in `vite.config.js`).

### Data flow

All content lives in `public/data.json` — an array of items with fields: `id, category, title, description, link, image, emoji`. The Express server is the sole reader/writer of this file. The frontend fetches from `/api/items` with a fallback to `/data.json` directly.

### Auth

Simple token auth: `POST /api/login` with hardcoded password (`relax2024`) returns a static token stored in `localStorage`. All mutating API calls send `Authorization: Bearer <token>`. There is no JWT or session expiry.

### Routing

Two routes via React Router:
- `/` — Main app (public)
- `/admin` — Admin panel, gated by `useAdmin` hook checking `localStorage` for token

### Admin panel (`src/admin/`)

- `useAdmin.js` — hook managing token state and `authFetch` wrapper
- `LoginPage.jsx` — password form
- `AdminPage.jsx` — item list with search/filter, add/edit/delete
- `ItemModal.jsx` — shared form for create and edit, includes image URL preview and emoji picker

### Main app (`src/components/`)

- `BottomNav` + `Sidebar` — both contain the same `CATEGORIES` array (must be kept in sync manually when categories change)
- `ContentGrid` — filters items client-side by `activeCategory`
- Categories are derived at runtime from data; the hardcoded arrays in nav components are display-only labels

### Planned migration

The app is intended to migrate from `data.json` to **Supabase** (PostgreSQL). Supabase URL: `https://lampcsbrwbrqtxosdeus.supabase.co`. When this migration happens, `server.js` should replace `readData()`/`writeData()` with Supabase client calls, and `public/data.json` becomes unused.
