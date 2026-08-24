/**
 * Domain model — single source of truth for the two entities this app renders.
 */

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly organizationId: string;
  readonly collaboratorCount: number;
  readonly lastModified: string;
}

export type CollaboratorRole = 'ADMIN' | 'WRITE' | 'COMMENT' | 'READ';

/**
 * A row in a project's direct-collaborator list. `id` is a person id when
 * `type` is 'user', or a group id when `type` is 'group' — a group row
 * grants every member of that group access at `role`, without adding a
 * row for each member. `GET /projects/:id/collaborators` returns these
 * rows only; it does not expand group rows into per-person access.
 */
export interface Collaborator {
  readonly id: string;
  readonly type: 'user' | 'group';
  readonly name: string;
  readonly email?: string;
  readonly role: CollaboratorRole;
}

export type PersonStatus = 'active' | 'inactive';

export interface Person {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly status: PersonStatus;
  readonly dateAdded: string;
}

export interface Group {
  readonly id: string;
  readonly name: string;
  readonly memberCount: number;
}

export interface GroupMember {
  readonly personId: string;
  readonly name: string;
  readonly email: string;
}

export interface Page<T> {
  readonly items: readonly T[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
}
