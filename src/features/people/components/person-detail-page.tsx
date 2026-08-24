import { useNavigate, useParams } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import { Skeleton } from '@/shared/ui/skeleton';
import { Badge } from '@/shared/ui/badge';
import { routes } from '@/shared/routes';
import { usePerson } from '../api';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

/**
 * Deliberately thin: name, email, status, date added — nothing about
 * project access. There is no aggregate-access endpoint to back a richer
 * view, and no placeholder here either; the absence is the point.
 */
export function PersonDetailPage() {
  const { personId = '' } = useParams<{ personId: string }>();
  const navigate = useNavigate();
  const { data: person, isLoading, isError } = usePerson(personId);

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 p-12 text-center">
        <AlertTriangle className="size-8 text-destructive" />
        <p className="text-sm text-muted-foreground">Couldn't load this person.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6">
      <button
        type="button"
        className="self-start text-left text-sm text-muted-foreground hover:text-foreground"
        onClick={() => navigate(routes.people)}
      >
        ← People
      </button>

      {isLoading || !person ? (
        <div className="max-w-md space-y-2">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
        </div>
      ) : (
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">{person.name}</h1>
            <Badge
              variant={person.status === 'active' ? 'outline' : 'secondary'}
              className={person.status === 'active' ? 'border-transparent bg-[var(--success-subtle)] text-[var(--success)]' : ''}
            >
              {person.status}
            </Badge>
          </div>
          <dl className="mt-4 grid grid-cols-[120px_1fr] gap-y-3 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd>{person.email}</dd>
            <dt className="text-muted-foreground">Date added</dt>
            <dd>{formatDate(person.dateAdded)}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}
