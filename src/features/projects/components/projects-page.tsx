import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { FolderKanban, AlertTriangle } from 'lucide-react';
import { EntityTable, type Column } from '@/shared/components/entity-table';
import { SearchInput } from '@/shared/components/search-input';
import { PaginationFooter } from '@/shared/components/pagination-footer';
import { routes } from '@/shared/routes';
import type { Project } from '@/shared/domain';
import { useProjects } from '../api';

const PAGE_SIZE = 25;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function ProjectsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useProjects(search, page, PAGE_SIZE);

  const columns: Column<Project>[] = useMemo(
    () => [
      { key: 'name', header: 'Name', width: '2fr', render: (p) => <span className="font-medium">{p.name}</span> },
      {
        key: 'collaboratorCount',
        header: 'Collaborators',
        width: '160px',
        align: 'right',
        render: (p) => p.collaboratorCount,
      },
      {
        key: 'lastModified',
        header: 'Last modified',
        width: '180px',
        render: (p) => formatDate(p.lastModified),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Projects</h1>
          <p className="text-sm text-muted-foreground">
            {data ? `${data.total} projects in Northwind Collective` : 'Loading projects…'}
          </p>
        </div>
      </div>

      <SearchInput
        placeholder="Search projects by name…"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-[var(--surface-rose)] py-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Couldn't load projects.</p>
          <button type="button" className="text-sm font-medium text-primary underline" onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : (
        <>
          <EntityTable
            columns={columns}
            data={data?.items ?? []}
            getRowKey={(p) => p.id}
            isLoading={isLoading && !data}
            onRowClick={(p) => navigate(routes.project(p.id))}
            emptyIcon={<FolderKanban className="size-8 text-muted-foreground" />}
            emptyMessage={search ? `No projects match "${search}".` : 'No projects yet.'}
          />
          {data && !isLoading && data.items.length > 0 && (
            <PaginationFooter page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
