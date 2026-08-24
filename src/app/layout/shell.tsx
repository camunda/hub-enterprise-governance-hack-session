import { Outlet } from 'react-router-dom';
import { TooltipProvider } from '@/shared/ui/tooltip';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';
import { ErrorBoundary } from '@/shared/components/error-boundary';

/**
 * The application shell — sidebar + top bar + content area.
 */
export function Shell() {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto" aria-label="Main content">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
