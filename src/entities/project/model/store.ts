import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Block } from '@/entities/block';
import type { Project, Dashboard } from './types';

interface ProjectStore {
  projects: Project[];
  activeProjectId: string | null;
  activeDashboardId: string | null;

  addProject: (name: string) => string;
  removeProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;

  addDashboard: (projectId: string, name: string) => string;
  removeDashboard: (projectId: string, dashboardId: string) => void;
  renameDashboard: (projectId: string, dashboardId: string, name: string) => void;

  addBlock: () => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, patch: Partial<Block>) => void;
  updateLayout: (items: ReadonlyArray<{ i: string; x: number; y: number; w: number; h: number }>) => void;

  setActive: (projectId: string, dashboardId: string) => void;
  clearActive: () => void;
}

function patchActiveDashboard(
  projects: Project[],
  activeProjectId: string | null,
  activeDashboardId: string | null,
  patch: (d: Dashboard) => Dashboard,
): Project[] {
  if (!activeProjectId || !activeDashboardId) return projects;
  return projects.map((p) =>
    p.id === activeProjectId
      ? { ...p, dashboards: p.dashboards.map((d) => (d.id === activeDashboardId ? patch(d) : d)) }
      : p,
  );
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      activeDashboardId: null,

      addProject: (name) => {
        const id = crypto.randomUUID();
        set((s) => ({
          projects: [...s.projects, { id, name, dashboards: [], createdAt: Date.now() }],
        }));
        return id;
      },

      removeProject: (id) =>
        set((s) => ({
          projects: s.projects.filter((p) => p.id !== id),
          activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
          activeDashboardId: s.activeProjectId === id ? null : s.activeDashboardId,
        })),

      renameProject: (id, name) =>
        set((s) => ({
          projects: s.projects.map((p) => (p.id === id ? { ...p, name } : p)),
        })),

      addDashboard: (projectId, name) => {
        const id = crypto.randomUUID();
        const dashboard: Dashboard = { id, name, blocks: [], createdAt: Date.now() };
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, dashboards: [...p.dashboards, dashboard] } : p,
          ),
        }));
        return id;
      },

      removeDashboard: (projectId, dashboardId) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId ? { ...p, dashboards: p.dashboards.filter((d) => d.id !== dashboardId) } : p,
          ),
          activeDashboardId: s.activeDashboardId === dashboardId ? null : s.activeDashboardId,
        })),

      renameDashboard: (projectId, dashboardId, name) =>
        set((s) => ({
          projects: s.projects.map((p) =>
            p.id === projectId
              ? {
                  ...p,
                  dashboards: p.dashboards.map((d) => (d.id === dashboardId ? { ...d, name } : d)),
                }
              : p,
          ),
        })),

      addBlock: () => {
        const { activeProjectId, activeDashboardId, projects } = get();
        if (!activeProjectId || !activeDashboardId) return;
        const activeDash = projects
          .find((p) => p.id === activeProjectId)
          ?.dashboards.find((d) => d.id === activeDashboardId);
        const bottomY = activeDash ? activeDash.blocks.reduce((acc, b) => Math.max(acc, b.y + b.h), 0) : 0;
        const newBlock: Block = {
          id: crypto.randomUUID(),
          x: 0,
          y: bottomY,
          w: 6,
          h: 4,
          datasetId: null,
          chartType: 'bar',
          dimension: null,
          measure: null,
          aggregation: 'SUM',
        };
        set((s) => ({
          projects: patchActiveDashboard(s.projects, activeProjectId, activeDashboardId, (d) => ({
            ...d,
            blocks: [...d.blocks, newBlock],
          })),
        }));
      },

      removeBlock: (blockId) => {
        const { activeProjectId, activeDashboardId } = get();
        set((s) => ({
          projects: patchActiveDashboard(s.projects, activeProjectId, activeDashboardId, (d) => ({
            ...d,
            blocks: d.blocks.filter((b) => b.id !== blockId),
          })),
        }));
      },

      updateBlock: (blockId, patch) => {
        const { activeProjectId, activeDashboardId } = get();
        set((s) => ({
          projects: patchActiveDashboard(s.projects, activeProjectId, activeDashboardId, (d) => ({
            ...d,
            blocks: d.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
          })),
        }));
      },

      updateLayout: (items) => {
        const { activeProjectId, activeDashboardId } = get();
        const byId = new Map(items.map((i) => [i.i, i]));
        set((s) => ({
          projects: patchActiveDashboard(s.projects, activeProjectId, activeDashboardId, (d) => ({
            ...d,
            blocks: d.blocks.map((b) => {
              const item = byId.get(b.id);
              if (!item) return b;
              if (item.x === b.x && item.y === b.y && item.w === b.w && item.h === b.h) return b;
              return { ...b, x: item.x, y: item.y, w: item.w, h: item.h };
            }),
          })),
        }));
      },

      setActive: (projectId, dashboardId) => set({ activeProjectId: projectId, activeDashboardId: dashboardId }),

      clearActive: () => set({ activeProjectId: null, activeDashboardId: null }),
    }),
    {
      name: 'project-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
