import type { Person, Project, Group, Collaborator } from '@/shared/domain';
import peopleData from './data/people.json';
import projectsData from './data/projects.json';
import groupsData from './data/groups.json';
import groupMembersData from './data/group-members.json';
import collaboratorsByProjectData from './data/collaborators-by-project.json';

/**
 * Fixed sample data for the mocked organisation "Northwind Collective".
 * This is frozen output, not generated at runtime — every candidate and
 * every interviewer sees the exact same data, byte for byte.
 */

export const PEOPLE: Person[] = peopleData as unknown as Person[];
export const PROJECTS: Project[] = projectsData as unknown as Project[];
export const GROUPS: Group[] = groupsData as unknown as Group[];

const GROUP_MEMBERS: Record<string, string[]> = groupMembersData;
const COLLABORATORS_BY_PROJECT: Record<string, Collaborator[]> = collaboratorsByProjectData as unknown as Record<
  string,
  Collaborator[]
>;

export function getCollaboratorsForProject(projectId: string): readonly Collaborator[] {
  return COLLABORATORS_BY_PROJECT[projectId] ?? [];
}

export function getGroupMembers(groupId: string): readonly Person[] {
  const memberIds = new Set(GROUP_MEMBERS[groupId] ?? []);
  return PEOPLE.filter((p) => memberIds.has(p.id));
}
