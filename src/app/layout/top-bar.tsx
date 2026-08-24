import { Moon, Sun, Monitor } from 'lucide-react';
import { Breadcrumbs } from './breadcrumbs';
import { useCurrentUser } from '@/shared/auth/current-user';
import { Button } from '@/shared/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/ui/dropdown-menu';
import { useUiStore } from '@/shared/stores/ui-store';

function ColorModeToggle() {
  const { colorMode, setColorMode } = useUiStore();

  const modes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" aria-label="Toggle color mode">
          {colorMode === 'dark' ? (
            <Moon className="size-4" />
          ) : colorMode === 'light' ? (
            <Sun className="size-4" />
          ) : (
            <Monitor className="size-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {modes.map(({ value, icon: Icon, label }) => (
          <DropdownMenuItem key={value} onClick={() => setColorMode(value)}>
            <Icon className="size-4" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const { data: currentUser } = useCurrentUser();
  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full"
          aria-label={`Signed in as ${currentUser.name}`}
        >
          <div className="flex size-7 items-center justify-center rounded-full bg-[var(--camunda-orange)]/10 text-[10px] font-bold text-[var(--camunda-orange)]">
            {initials}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">{currentUser.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="text-xs text-muted-foreground">
          Administrator — fixed session, no sign-out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TopBar() {
  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b bg-card px-4">
      <Breadcrumbs />

      <div className="flex items-center gap-1.5">
        <ColorModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
