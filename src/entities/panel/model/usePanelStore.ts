import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Panel } from '@/shared/types';

interface PanelStore {
  panels: Record<string, Panel>;

  addPanel: (panel: Panel) => void;
  removePanel: (id: string) => void;
  updatePanel: (id: string, patch: Partial<Panel>) => void;
}

export const usePanelStore = create<PanelStore>()(
  persist(
    immer((set) => ({
      panels: {},

      addPanel: (panel) =>
        set((state) => {
          state.panels[panel.id] = panel;
        }),

      removePanel: (id) =>
        set((state) => {
          delete state.panels[id];
        }),

      updatePanel: (id, patch) =>
        set((state) => {
          if (state.panels[id]) {
            Object.assign(state.panels[id], patch);
          }
        }),
    })),
    {
      name: 'webbi-panels',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
