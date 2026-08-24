import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { AlertTriangle, Users } from 'lucide-react';
import { EntityTable, type Column } from '@/shared/components/entity-table';
import { SearchInput } from '@/shared/components/search-input';
import { PaginationFooter } from '@/shared/components/pagination-footer';
import { Badge } from '@/shared/ui/badge';
import { routes } from '@/shared/routes';
import type { Person } from '@/shared/domain';
import { usePeople } from '../api';

const PAGE_SIZE = 25;

export function PeoplePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = usePeople(search, page, PAGE_SIZE);

  const columns: Column<Person>[] = useMemo(
    () => [
      { key: 'name', header: 'Name', width: '2fr', render: (p) => <span className="font-medium">{p.name}</span> },
      { key: 'email', header: 'Email', width: '2fr', render: (p) => p.email },
      {
        key: 'status',
        header: 'Status',
        width: '120px',
        render: (p) => (
          <Badge
            variant={p.status === 'active' ? 'outline' : 'secondary'}
            className={p.status === 'active' ? 'border-transparent bg-[var(--success-subtle)] text-[var(--success)]' : ''}
          >
            {p.status}
          </Badge>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-xl font-semibold">People</h1>
        <p className="text-sm text-muted-foreground">
          {data ? `${data.total} people in Northwind Collective` : 'Loading people…'}
        </p>
      </div>

      <SearchInput
        placeholder="Search people by name or email…"
        onSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
      />

      {isError ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-destructive/30 bg-[var(--surface-rose)] py-12 text-center">
          <AlertTriangle className="size-8 text-destructive" />
          <p className="text-sm text-muted-foreground">Couldn't load people.</p>
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
            onRowClick={(p) => navigate(routes.person(p.id))}
            emptyIcon={<Users className="size-8 text-muted-foreground" />}
            emptyMessage={search ? `No people match "${search}".` : 'No people yet.'}
          />
          {data && !isLoading && data.items.length > 0 && (
            <PaginationFooter page={data.page} pageSize={data.pageSize} total={data.total} onPageChange={setPage} />
          )}
        </>
      )}
    </div>
  );
}
