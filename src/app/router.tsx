import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Shell } from './layout/shell';
import { Skeleton } from '@/shared/ui/skeleton';
import { routePatterns } from '@/shared/routes';

/**
 * Router — composed from routePatterns config. No hardcoded path strings here.
 */

const ProjectsPage = lazy(() =>
  import('@/features/projects/components/projects-page').then((m) => ({ default: m.ProjectsPage })),
);
const ProjectDetailPage = lazy(() =>
  import('@/features/projects/components/project-detail-page').then((m) => ({ default: m.ProjectDetailPage })),
);
const PeoplePage = lazy(() =>
  import('@/features/people/components/people-page').then((m) => ({ default: m.PeoplePage })),
);
const PersonDetailPage = lazy(() =>
  import('@/features/people/components/person-detail-page').then((m) => ({ default: m.PersonDetailPage })),
);

function PageSkeleton() {
  return (
    <div className="flex flex-col gap-4 p-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-96" />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    </div>
  );
}

function Lazy({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<Shell />}>
        <Route index element={<Navigate to={routePatterns.projects} replace />} />

        <Route path={routePatterns.projects} element={<Lazy><ProjectsPage /></Lazy>} />
        <Route path={routePatterns.project} element={<Lazy><ProjectDetailPage /></Lazy>} />

        <Route path={routePatterns.people} element={<Lazy><PeoplePage /></Lazy>} />
        <Route path={routePatterns.person} element={<Lazy><PersonDetailPage /></Lazy>} />

        <Route path="*" element={<Navigate to={routePatterns.projects} replace />} />
      </Route>
    </Routes>
  );
}
