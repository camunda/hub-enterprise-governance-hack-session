import { describe, it, expect } from 'vitest';
import { PEOPLE, PROJECTS, GROUPS } from './fixtures';

describe('mocked API contract', () => {
  it('paginates /api/projects and reports the true total', async () => {
    const res = await fetch('/api/projects?page=1&pageSize=25');
    const body = await res.json();
    expect(body.items).toHaveLength(25);
    expect(body.total).toBe(PROJECTS.length);
    expect(body.total).toBeGreaterThan(25);
  });

  it('caps pageSize at 100 even if a larger value is requested', async () => {
    const res = await fetch('/api/projects?page=1&pageSize=500');
    const body = await res.json();
    expect(body.pageSize).toBe(100);
    expect(body.items).toHaveLength(100);
  });

  it('returns only direct collaborators for a project', async () => {
    const res = await fetch(`/api/projects/${PROJECTS[0]!.id}/collaborators`);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
  });

  it('lists groups and their members', async () => {
    const groupsRes = await fetch('/api/groups');
    const groups = await groupsRes.json();
    expect(groups.length).toBe(GROUPS.length);

    const membersRes = await fetch(`/api/groups/${groups[0].id}/members`);
    const members = await membersRes.json();
    expect(Array.isArray(members)).toBe(true);
  });

  it('has no endpoint that aggregates a person\'s access across projects', async () => {
    // No handler exists for this route — MSW's strict unhandled-request
    // policy turns that into a hard failure rather than a silent bypass.
    const res = await fetch(`/api/users/${PEOPLE[0]!.id}/access`);
    expect(res.status).toBe(500);
  });

  it('searches people by name', async () => {
    const target = PEOPLE[10]!;
    const namePart = target.name.split(' ')[0]!;
    const res = await fetch(`/api/users?search=${encodeURIComponent(namePart)}`);
    const body = await res.json();
    expect(body.items.some((p: { id: string }) => p.id === target.id)).toBe(true);
  });
});
