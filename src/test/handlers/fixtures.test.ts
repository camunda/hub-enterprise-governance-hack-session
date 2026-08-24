import { describe, it, expect } from 'vitest';
import { PEOPLE, PROJECTS, GROUPS, getCollaboratorsForProject } from './fixtures';

describe('fixture shape', () => {
  it('has the expected volume', () => {
    expect(PEOPLE.length).toBe(60);
    expect(PROJECTS.length).toBe(240);
    expect(GROUPS.length).toBe(8);
  });

  it('every project id is unique', () => {
    expect(new Set(PROJECTS.map((p) => p.id)).size).toBe(PROJECTS.length);
  });

  it('every person email uses the fictional domain', () => {
    expect(PEOPLE.every((p) => p.email.endsWith('@northwind-collective.example'))).toBe(true);
  });
});

describe('project collaborators endpoint contract', () => {
  it('some project has at least one group-type collaborator row', () => {
    const anyGroupRow = PROJECTS.some((p) =>
      getCollaboratorsForProject(p.id).some((r) => r.type === 'group'),
    );
    expect(anyGroupRow).toBe(true);
  });

  it("project.collaboratorCount matches the collaborators endpoint's row count", () => {
    for (const project of PROJECTS) {
      expect(project.collaboratorCount).toBe(getCollaboratorsForProject(project.id).length);
    }
  });

  it('totals roughly ~900 collaborator rows across the organisation', () => {
    const total = PROJECTS.reduce((sum, p) => sum + p.collaboratorCount, 0);
    expect(total).toBeGreaterThan(700);
    expect(total).toBeLessThan(1100);
  });

  it('has at least one person with zero access and one with very broad access', () => {
    const accessCounts = new Map<string, number>();
    for (const project of PROJECTS) {
      for (const row of getCollaboratorsForProject(project.id)) {
        if (row.type !== 'user') continue;
        accessCounts.set(row.id, (accessCounts.get(row.id) ?? 0) + 1);
      }
    }
    const counts = PEOPLE.map((p) => accessCounts.get(p.id) ?? 0);
    expect(counts.filter((c) => c === 0).length).toBeGreaterThan(0);
    expect(Math.max(...counts)).toBeGreaterThan(30);
  });
});
