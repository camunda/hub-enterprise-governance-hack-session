# Camunda Hub — access review exercise

A small admin UI for a fictional organisation, "Northwind Collective":
projects, their collaborators, and the people in the org.

There is **no backend**. Every API call is intercepted in the browser and
answered with fixed, deterministic sample data — nothing is real, nothing
is fetched from a server, and there is nothing to configure.

## Running it

Prerequisites: Node.js (version pinned in `.tool-versions`).

```bash
npm ci
npm run dev
```

Then open the printed local URL (typically `http://localhost:5173`). You're
signed in automatically as a fixed administrator — there is no login screen.

## Where to look

- `src/features/` — the two screens (Projects, People) and their API hooks
- `src/shared/` — layout, the small UI kit, routing, the fixed session
- `src/test/handlers/` — the mock API (`handlers.ts`) and its sample data
  (`fixtures.ts`)
- `docs/API.md` — reference for the seven mocked endpoints

## Other commands

```bash
npm run typecheck   # tsc --noEmit
npm test            # vitest
npm run build       # production build
npm run lint         # eslint
```
