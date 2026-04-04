import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Breakpoint, Dashboard, DashboardLayout } from '@/shared/types';

interface DashboardStore {
  dashboards: Record<string, Dashboard>;

  addDashboard: (dashboard: Dashboard) => void;
  removeDashboard: (id: string) => void;
  removeDashboards: (projectId: string) => void;

  addPanelToDashboard: (dashboardId: string, panelId: string) => void;
  removePanelFromDashboard: (dashboardId: string, panelId: string) => void;

  updateLayout: (dashboardId: string, items: Partial<Record<Breakpoint, DashboardLayout>>) => void;
}

export const useDashboardStore = create<DashboardStore>()(
  persist(
    immer((set) => ({
      dashboards: {},

      addDashboard: (dashboard) =>
        set((state) => {
          state.dashboards[dashboard.id] = dashboard;
        }),

      removeDashboard: (id) =>
        set((state) => {
          delete state.dashboards[id];
        }),

      removeDashboards: (projectId: string) => {
        set((s) => ({
          dashboards: Object.fromEntries(Object.entries(s.dashboards).filter(([, d]) => d.projectId !== projectId)),
        }));
      },

      addPanelToDashboard: (dashboardId, panelId) =>
        set((state) => {
          if (state.dashboards[dashboardId]) {
            state.dashboards[dashboardId].panelIds.push(panelId);
          }
        }),

      removePanelFromDashboard: (dashboardId, panelId) =>
        set((state) => {
          if (state.dashboards[dashboardId]) {
            state.dashboards[dashboardId].panelIds = state.dashboards[dashboardId].panelIds.filter(
              (id) => id !== panelId,
            );
            for (const bp of Object.keys(state.dashboards[dashboardId].layouts) as Breakpoint[]) {
              if (state.dashboards[dashboardId].layouts[bp]) {
                state.dashboards[dashboardId].layouts[bp] = state.dashboards[dashboardId].layouts[bp]!.filter(
                  (item) => item.i !== panelId,
                );
              }
            }
          }
        }),

      updateLayout: (dashboardId, items) =>
        set((state) => {
          if (state.dashboards[dashboardId]) {
            state.dashboards[dashboardId].layouts = items;
          }
        }),
    })),
    {
      name: 'webbi-dashboards',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
