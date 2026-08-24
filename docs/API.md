# Mock API reference

There is no backend. Every request below is intercepted in the browser by
[MSW](https://mswjs.io/) and answered from a fixed, deterministic dataset
generated at `src/test/handlers/fixtures.ts`. The data is fictional —
names, emails, and project names are all invented.

All endpoints are read-only.

## Pagination envelope

`GET /api/users` and `GET /api/projects` return:

```json
{
  "items": [ /* page of results */ ],
  "page": 1,
  "pageSize": 25,
  "total": 240
}
```

- `pageSize` defaults to `25` if omitted, and is capped at `100` even if a
  larger value is requested.
- `total` is the count across the *entire* collection, not just the page
  you fetched. Don't assume `items.length === total`.

## Endpoints

### `GET /api/users`

Paginated list of people in the organisation.

Query params: `search` (matches name or email, case-insensitive), `page`, `pageSize`.

Returns: `Page<Person>` where `Person` is `{ id, name, email, status, dateAdded }`.

### `GET /api/users/:id`

A single person. 404 if the id doesn't exist.

### `GET /api/projects`

Paginated list of projects.

Query params: `search` (matches name, case-insensitive), `page`, `pageSize`.

Returns: `Page<Project>` where `Project` is
`{ id, name, organizationId, collaboratorCount, lastModified }`.

### `GET /api/projects/:id`

A single project. 404 if the id doesn't exist.

### `GET /api/projects/:id/collaborators`

**Direct collaborators only.** Returns an array of:

```ts
{ id: string; type: 'user' | 'group'; name: string; email?: string; role: string }
```

A row with `type: 'group'` means that *group* was added as a collaborator
on this project — every member of that group has `role` access to it, but
that access is **not** expanded into a row per member here. If you need
to know whether a specific person can reach this project, and they don't
appear as a `type: 'user'` row, you still need to check whether they
belong to any group that appears as a `type: 'group'` row.

There is deliberately no endpoint that does this check for you across all
of a person's projects — see below.

`role` is one of the roles Web Modeler already ships: `ADMIN` ("Project
Admin"), `WRITE` ("Editor"), `COMMENT` ("Commenter"), `READ` ("Viewer").

### `GET /api/groups`

All groups in the organisation. Returns `{ id, name, memberCount }[]`.

### `GET /api/groups/:id/members`

The people in a group. Returns `Person[]`. 404 if the group id doesn't exist.

## What doesn't exist

There is no endpoint that aggregates a person's access across projects
(e.g. no `GET /api/users/:id/access`). To answer "what can this person
reach", you need to combine `/api/projects`, `/api/projects/:id/collaborators`,
`/api/groups`, and `/api/groups/:id/members` yourself — including the
group-membership case described above.

## Simulated network conditions

Every handler adds a random 120–350ms delay, and `/api/projects` is a
real paginated collection (240 projects) — fetching page 1 does not give
you all of them.
