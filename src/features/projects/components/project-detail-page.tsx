import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMemo } from 'react';
import { AlertTriangle, Users2 } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { Badge } from '@/shared/ui/badge';
import { EntityTable, type Column } from '@/shared/components/entity-table';
import { EmptyState } from '@/shared/components/empty-state';
import { routes } from '@/shared/routes';
import type { Collaborator } from '@/shared/domain';
import { ROLE_MAP } from '@/shared/domain/roles';
import { useProject, useProjectCollaborators } from '../api';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ProjectDetailPage() {
  const { projectId = '' } = useParams<{ projectId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeTab = searchParams.get('tab') === 'collaborators' ? 'collaborators' : 'overview';

  const { data: project, isLoading: projectLoading, isError: projectError } = useProject(projectId);
  const { data: collaborators, isLoading: collaboratorsLoading } = useProjectCollaborators(projectId);

  const columns: Column<Collaborator>[] = useMemo(
    () => [
      {
        key: 'name',
        header: 'Name',
        width: '2fr',
        render: (c) => (
          <div className="flex items-center gap-2">
            <span className="font-medium">{c.name}</span>
            {c.type === 'group' && (
              <Badge variant="secondary" className="text-[10px]">
                Group
              </Badge>
            )}
          </div>
        ),
      },
      {
        key: 'email',
        header: 'Email',
        width: '2fr',
        render: (c) => c.email ?? <span className="text-muted-foreground">—</span>,
      },
      {
        key: 'role',
        header: 'Role',
        width: '160px',
        render: (c) => ROLE_MAP[c.role]?.label ?? c.role,
      },
    ],
    [],
  );

  if (projectError) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <AlertTriangle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Couldn't load this project.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      {projectLoading || !project ? (
        <div className="space-y-2">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
      ) : (
        <div>
          <button
            type="button"
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => navigate(routes.projects)}
          >
            ← Projects
          </button>
          <h1 className="text-xl font-semibold">{project.name}</h1>
        </div>
      )}

      <Tabs
        value={activeTab}
        onValueChange={(value) => setSearchParams(value === 'overview' ? {} : { tab: value })}
      >
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="collaborators">
            Collaborators
            {project && ` (${project.collaboratorCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4">
          {project && (
            <dl className="grid max-w-md grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted-foreground">Project ID</dt>
              <dd className="font-mono text-xs">{project.id}</dd>
              <dt className="text-muted-foreground">Last modified</dt>
              <dd>{formatDate(project.lastModified)}</dd>
              <dt className="text-muted-foreground">Direct collaborators</dt>
              <dd>{project.collaboratorCount}</dd>
            </dl>
          )}
        </TabsContent>

        <TabsContent value="collaborators" className="pt-4">
          {collaborators && collaborators.length === 0 && !collaboratorsLoading ? (
            <EmptyState
              icon={Users2}
              headline="No direct collaborators"
              story="Nobody has been added directly to this project yet. Group-based access, if any, is not shown here — check the Groups list."
              variant="section"
            />
          ) : (
            <EntityTable
              columns={columns}
              data={collaborators ?? []}
              getRowKey={(c) => c.id}
              isLoading={collaboratorsLoading && !collaborators}
              emptyMessage="No direct collaborators."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
