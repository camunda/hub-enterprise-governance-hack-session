import { Shield, Pencil, Eye } from 'lucide-react';
import type { CollaboratorRole } from './types';

export interface RoleDefinition {
  readonly key: CollaboratorRole;
  readonly label: string;
  readonly description: string;
  readonly icon: React.ComponentType<{ className?: string }>;
  readonly color: string;
  readonly bg: string;
}

export const ROLES: readonly RoleDefinition[] = [
  {
    key: 'ADMIN',
    label: 'Project Admin',
    description: 'Full access — manage collaborators, settings, and all content',
    icon: Shield,
    color: 'text-[var(--info)]',
    bg: 'bg-[var(--info-subtle)]',
  },
  {
    key: 'WRITE',
    label: 'Editor',
    description: 'Create and edit content',
    icon: Pencil,
    color: 'text-[var(--success)]',
    bg: 'bg-[var(--success-subtle)]',
  },
  {
    key: 'COMMENT',
    label: 'Commenter',
    description: 'View content and add comments — cannot edit',
    icon: Eye,
    color: 'text-[var(--warning)]',
    bg: 'bg-[var(--warning-subtle)]',
  },
  {
    key: 'READ',
    label: 'Viewer',
    description: 'View-only access — cannot edit or comment',
    icon: Eye,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
  },
];

export const ROLE_MAP: Record<CollaboratorRole, RoleDefinition> = Object.fromEntries(
  ROLES.map((r) => [r.key, r]),
) as Record<CollaboratorRole, RoleDefinition>;
