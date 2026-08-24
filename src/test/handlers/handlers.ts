import { http, HttpResponse, delay } from 'msw';
import { PEOPLE, PROJECTS, GROUPS, getCollaboratorsForProject, getGroupMembers } from './fixtures';
import type { Page } from '@/shared/domain';

/**
 * The mocked API surface. Seven endpoints — no more.
 *
 * There is deliberately NO `GET /api/users/:id/access` (or anything else
 * that aggregates a person's access across projects). The data to answer
 * "what can this person reach" exists, but no single call returns it —
 * that gap is the exercise. Do not add one here.
 */

const MIN_LATENCY_MS = 120;
const MAX_LATENCY_MS = 350;

async function simulateLatency(): Promise<void> {
  await delay(MIN_LATENCY_MS + Math.random() * (MAX_LATENCY_MS - MIN_LATENCY_MS));
}

function paginate<T>(items: readonly T[], url: URL): Page<T> {
  const page = Math.max(1, Math.trunc(Number(url.searchParams.get('page') ?? '1')) || 1);
  const requestedPageSize = Math.trunc(Number(url.searchParams.get('pageSize') ?? '25')) || 25;
  const pageSize = Math.min(100, Math.max(1, requestedPageSize));
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), page, pageSize, total: items.length };
}

function matches(haystack: string, search: string): boolean {
  return haystack.toLowerCase().includes(search.toLowerCase());
}

export const handlers = [
  http.get('/api/users', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? '';
    const filtered = search
      ? PEOPLE.filter((p) => matches(p.name, search) || matches(p.email, search))
      : PEOPLE;
    return HttpResponse.json(paginate(filtered, url));
  }),

  http.get('/api/users/:id', async ({ params }) => {
    await simulateLatency();
    const person = PEOPLE.find((p) => p.id === params.id);
    if (!person) return HttpResponse.json({ message: 'Person not found' }, { status: 404 });
    return HttpResponse.json(person);
  }),

  http.get('/api/projects/:id/collaborators', async ({ params }) => {
    await simulateLatency();
    const project = PROJECTS.find((p) => p.id === params.id);
    if (!project) return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    return HttpResponse.json(getCollaboratorsForProject(project.id));
  }),

  http.get('/api/projects/:id', async ({ params }) => {
    await simulateLatency();
    const project = PROJECTS.find((p) => p.id === params.id);
    if (!project) return HttpResponse.json({ message: 'Project not found' }, { status: 404 });
    return HttpResponse.json(project);
  }),

  http.get('/api/projects', async ({ request }) => {
    await simulateLatency();
    const url = new URL(request.url);
    const search = url.searchParams.get('search') ?? '';
    const filtered = search ? PROJECTS.filter((p) => matches(p.name, search)) : PROJECTS;
    return HttpResponse.json(paginate(filtered, url));
  }),

  http.get('/api/groups', async () => {
    await simulateLatency();
    return HttpResponse.json(GROUPS);
  }),

  http.get('/api/groups/:id/members', async ({ params }) => {
    await simulateLatency();
    const group = GROUPS.find((g) => g.id === params.id);
    if (!group) return HttpResponse.json({ message: 'Group not found' }, { status: 404 });
    return HttpResponse.json(getGroupMembers(group.id));
  }),
];
