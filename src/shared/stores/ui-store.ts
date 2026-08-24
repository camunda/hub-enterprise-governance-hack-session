import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * UI Store — ONLY visual preferences and transient UI state.
 * Never store entity IDs here (read those from URL params);
 * never store server data here (that's react-query's job).
 */

type ColorMode = 'light' | 'dark' | 'system';

interface UiState {
  readonly sidebarCollapsed: boolean;
  readonly colorMode: ColorMode;
}

interface UiActions {
  toggleSidebar(): void;
  setColorMode(mode: ColorMode): void;
}

type UiStore = UiState & UiActions;

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      colorMode: 'system',

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setColorMode: (mode) => set({ colorMode: mode }),
    }),
    { name: 'hub-ui' },
  ),
);
