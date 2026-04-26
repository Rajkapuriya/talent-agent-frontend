# Talent Agent Client

Frontend application for the Talent Agent platform, built with React + Vite.

## Tech Stack

- React 18
- Vite 5
- React Router
- Zustand
- Axios
- Tailwind CSS
- React Hook Form + Zod

## What This App Does

- Recruiter login flow
- Job creation and listing
- Pipeline run monitoring via SSE
- Candidate pool browsing and filtering
- Ranked shortlist visualization
- Shortlist CSV export

## Project Structure

- `src/main.jsx` - React entrypoint
- `src/App.jsx` - route definitions and app shell
- `src/api/` - API clients and axios instance
- `src/pages/` - top-level page screens
- `src/components/` - reusable UI and pipeline components
- `src/store/` - Zustand state stores
- `src/hooks/` - custom hooks (`usePipelineSSE`, `useShortlist`)
- `src/styles/globals.css` - global styles and tokens

## Routing

Public:

- `/login`

App screens:

- `/` - dashboard
- `/jobs/new` - create job
- `/jobs/:id` - job detail
- `/pipeline/:jobId/:runId` - live pipeline progress
- `/shortlist/:jobId` - ranked shortlist
- `/candidates` - candidate pool

## Environment Variables

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

Notes:

- `VITE_API_URL` should point to server API base (not root host).
- If backend runs on another host/port, update this value.

## Installation

```bash
cd client
npm install
```

## Run

Development:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Tests:

```bash
npm run test
```

## Auth Handling

- JWT token is stored in localStorage via Zustand persisted store.
- Axios request interceptor attaches `Authorization: Bearer <token>`.
- On `401`, client clears auth storage and redirects to `/login`.

## Pipeline Progress (SSE)

Pipeline page consumes server-sent events from:

- `GET /api/pipeline/:runId/progress`

The UI updates stage states for:

- parsing
- discovered
- scoring
- engaging
- ranking
- complete

## Common Issues

- **API not reachable**
  - Verify `VITE_API_URL` and backend server status.
- **CORS blocked**
  - Ensure your frontend origin is allowed by backend CORS config in `server/src/app.js`.
- **Login loop / forced logout**
  - Usually caused by expired/invalid token and expected 401 redirect behavior.

## Related Server Docs

See `server/README.md` for backend setup, API contracts, vector search configuration, and pipeline internals.
