import { Link, useLocation } from 'react-router-dom';
import { FolderKanban, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/ui/lib/utils';
import { Button } from '@/shared/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/ui/tooltip';
import { ScrollArea } from '@/shared/ui/scroll-area';
import { Separator } from '@/shared/ui/separator';
import { useUiStore } from '@/shared/stores/ui-store';
import { routes } from '@/shared/routes';
import { CamundaLogo } from './camunda-logo';

interface NavItem {
  readonly label: string;
  readonly path: string;
  readonly icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: readonly NavItem[] = [
  { label: 'Projects', path: routes.projects, icon: FolderKanban },
  { label: 'People', path: routes.people, icon: Users },
];

function NavLink({ item, collapsed, isActive }: { item: NavItem; collapsed: boolean; isActive: boolean }) {
  const Icon = item.icon;
  const linkContent = (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
        isActive
          ? 'border-l-2 border-[var(--sidebar-primary)] bg-[var(--surface-hover)] text-[var(--sidebar-primary)] font-medium'
          : 'border-l-2 border-transparent text-[var(--sidebar-foreground)] font-normal hover:bg-[var(--surface-hover)]',
        collapsed && 'justify-center px-2 border-l-0',
      )}
    >
      <Icon className="size-5 shrink-0" />
      {!collapsed && <span>{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }
  return linkContent;
}

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-[var(--sidebar)] transition-[width] duration-300 ease-[var(--ease-out)]',
        sidebarCollapsed ? 'w-[60px]' : 'w-[240px]',
      )}
    >
      <div className={cn('flex h-14 items-center px-4 shadow-[0_1px_0_var(--border)]', sidebarCollapsed && 'justify-center px-2')}>
        <Link to={routes.projects}>
          <CamundaLogo collapsed={sidebarCollapsed} />
        </Link>
      </div>

      <ScrollArea className="flex-1 py-3">
        <nav className="flex flex-col gap-1 px-2" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              collapsed={sidebarCollapsed}
              isActive={location.pathname.startsWith(item.path)}
            />
          ))}
        </nav>
      </ScrollArea>

      <Separator />
      <div className={cn('flex items-center p-2', sidebarCollapsed ? 'justify-center' : 'justify-end')}>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="size-8"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!sidebarCollapsed}
        >
          {sidebarCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>
    </aside>
  );
}
