import { Link, useLocation, useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { routes } from '@/shared/routes';
import { useProject } from '@/features/projects/api';
import { usePerson } from '@/features/people/api';

interface Crumb {
  readonly label: string;
  readonly href?: string;
}

function CrumbNav({ crumbs }: { crumbs: readonly Crumb[] }) {
  if (crumbs.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm min-w-0">
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;
        return (
          <span key={`${index}-${crumb.label}`} className="flex items-center gap-1 min-w-0">
            {index > 0 && <ChevronRight className="size-3.5 shrink-0 text-muted-foreground opacity-30" />}
            {crumb.href && !isLast ? (
              <Link
                to={crumb.href}
                className="text-muted-foreground/80 hover:text-foreground transition-colors truncate max-w-[240px]"
              >
                {crumb.label}
              </Link>
            ) : (
              <span
                className={`truncate max-w-[240px] ${isLast ? 'font-semibold text-foreground' : 'text-muted-foreground/80'}`}
              >
                {crumb.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function Breadcrumbs() {
  const location = useLocation();
  const params = useParams<{ projectId?: string; personId?: string }>();
  const path = location.pathname;

  const { data: project } = useProject(params.projectId ?? '');
  const { data: person } = usePerson(params.personId ?? '');

  if (path === routes.people) {
    return <CrumbNav crumbs={[{ label: 'People' }]} />;
  }
  if (params.personId) {
    return (
      <CrumbNav
        crumbs={[
          { label: 'People', href: routes.people },
          { label: person?.name ?? params.personId.slice(0, 8) },
        ]}
      />
    );
  }
  if (params.projectId) {
    return (
      <CrumbNav
        crumbs={[
          { label: 'Projects', href: routes.projects },
          { label: project?.name ?? params.projectId.slice(0, 8) },
        ]}
      />
    );
  }

  return <CrumbNav crumbs={[{ label: 'Projects' }]} />;
}
