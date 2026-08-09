# Stockroom — Inventory Management Application

A simple inventory management app built for the Levelworks internship assignment:
a **Lit** frontend talking to an **ERPNext** backend over its REST API, containerized
with Docker so the whole thing starts with one command.

- Frontend: `http://localhost:8080`
- ERPNext: `http://localhost:8000`

## Prerequisites

- Docker and Docker Compose v2 (`docker compose version`)
- ~4 GB RAM free for the ERPNext/MariaDB containers
- Ports `8000` and `8080` free on your machine

## Project structure

```
.
├── docker-compose.yml
├── backend/                      # ERPNext container + custom app
│   ├── Dockerfile
│   ├── init-scripts/start.sh     # site creation, app install, CORS setup
│   └── apps/inventory_management # custom Frappe app (Inventory Item DocType)
└── frontend/                     # Lit + Vite app, served by nginx in prod
    └── src/
        ├── components/           # app-root + reusable Lit elements
        └── services/erpnext-api.js
```

## Setup instructions

### 1. First start (creates the ERPNext site)

```bash
docker compose up --build
```

This will:
- Start MariaDB and Redis
- Build the `backend` image (official `frappe/erpnext:v15` + our custom app)
- On first boot, create a new ERPNext site, install the `inventory_management`
  app (which defines the **Inventory Item** DocType), enable developer mode,
  and allow CORS from `http://localhost:8080`
- Build and serve the Lit frontend via nginx on port 8080

The first boot can take **several minutes** (site creation + app install).
Watch the `backend` logs — it's ready when you see the bench web server start.

### 2. Connect the frontend to ERPNext (API key/secret)

The frontend authenticates to ERPNext's REST API with a token. After the
backend is up:

1. Open `http://localhost:8000`, log in as `Administrator` / `admin`
   (the default password set in `docker-compose.yml`).
2. Go to your user (top right avatar) → **My Settings** → **API Access** →
   **Generate Keys**. Copy the API Key and API Secret.
3. Copy `.env.example` to `.env` in the project root and fill in:
   ```
   ERPNEXT_API_KEY=your_key
   ERPNEXT_API_SECRET=your_secret
   ```
4. Rebuild just the frontend so the keys get baked into the build:
   ```bash
   docker compose up --build frontend
   ```

### 3. Everyday use

```bash
docker compose up
```

Visit `http://localhost:8080`. Use the **Admin mode** switch in the header to
show/hide the add/edit/delete controls (there's no login gate in this build —
see Assumptions below).

## Features

**Admin**
- Add / edit / delete inventory items (name, description, image, tags, date added)

**End user**
- View items in list or grid layout
- Search by name or description
- Sort by date added or name (asc/desc)
- Filter by tag
- Empty states for no items / no search results

## How it works

- The custom `Inventory Item` DocType lives in `backend/apps/inventory_management`
  and is auto-synced into ERPNext by `bench migrate` on container start — no
  manual fixture import needed.
- The Lit frontend calls ERPNext's standard REST API directly
  (`/api/resource/Inventory Item`), using `filters` / `or_filters` / `order_by`
  query params for search, tag filtering, and sorting, and
  `/api/method/upload_file` for image uploads.
- `app-root` owns all state (items, filters, modal/dialog visibility) and
  passes data down to small, single-purpose Lit elements (`item-card`,
  `search-bar`, `sort-bar`, `filter-bar`, `view-toggle`, `item-form-modal`,
  `confirm-dialog`, `toast-notification`), communicating back up via
  `CustomEvent`s — no shared/global state library needed at this scale.

## Assumptions & implementation notes

- **No Figma file was available** for this build, so the UI (a "stockroom /
  shelf-tag" visual direction: warm paper background, amber accent, pine-green
  tag pills, monospace dates) was designed from the written requirements. Swap
  in the real Figma redlines by adjusting `frontend/src/styles/tokens.css` and
  the component styles.
- **Tags** are stored as a comma-separated `Data` field on `Inventory Item`
  rather than a linked child-table of a separate `Tag` DocType. This keeps the
  REST payloads and the form simple, and still supports filtering via ERPNext's
  `like` operator. A production version would likely use a `Table MultiSelect`
  field against a dedicated `Tag` DocType for referential integrity.
- **Admin vs. end user** is a simple UI toggle in this build, not a real login
  gate — there's no separate auth flow for the two roles. A real deployment
  would gate the toggle (or route) behind ERPNext user roles/permissions.
- **API auth**: the frontend uses an ERPNext API key/secret baked in at build
  time (see setup step 2). This is simplest for a local/dev assignment; a
  production app would proxy requests through a backend-for-frontend rather
  than shipping credentials in a client bundle.
- **Image storage**: uploaded images are stored on the ERPNext backend itself
  (via `/api/method/upload_file`) and served from `http://localhost:8000`.
- The suggested architecture explicitly avoids bundling the frontend into
  ERPNext's own Frappe app/asset pipeline — the two services stay independent
  and only talk over REST, per the assignment brief.

## Troubleshooting

- **Backend keeps restarting on first boot**: site creation can take a few
  minutes on a cold MariaDB volume; check `docker compose logs -f backend`.
- **CORS errors in the browser console**: confirm `FRONTEND_ORIGIN` in
  `docker-compose.yml` matches the origin you're loading the frontend from.
- **"To start with, add items to Tags" filter is empty**: the tag filter
  dropdown is populated from tags already present on existing items — it's
  empty until at least one item has tags.
