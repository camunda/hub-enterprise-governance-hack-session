import { useEffect } from 'react';
import { useUiStore } from '@/shared/stores/ui-store';

/**
 * Synchronizes the color mode preference to the <html> element.
 * Supports 'light', 'dark', and 'system' (follows OS preference).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const colorMode = useUiStore((s) => s.colorMode);

  useEffect(() => {
    const root = document.documentElement;

    function applyMode(mode: 'light' | 'dark') {
      root.classList.toggle('dark', mode === 'dark');
    }

    if (colorMode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyMode(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => applyMode(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    applyMode(colorMode);
  }, [colorMode]);

  return <>{children}</>;
}
