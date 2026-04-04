import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { Project } from '@/shared/types';

interface ProjectStore {
  projects: Record<string, Project>;
  activeProject: { projectId: string | null; dashboardId: string | null };

  addProject: (name: string) => string;
  removeProject: (id: string) => void;
  renameProject: (id: string, name: string) => void;

  addDashboardToProject: (projectId: string, dashboardId: string) => void;
  removeDashboardFromProject: (projectId: string, dashboardId: string) => void;

  setActiveProject: (projectId: string, dashboardId: string) => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    immer((set) => ({
      projects: {},
      activeProject: { projectId: null, dashboardId: null },

      addProject: (name) => {
        const id = crypto.randomUUID();
        set((state) => {
          state.projects[id] = { id, name, dashboardIds: [], createdAt: Date.now() };
        });
        return id;
      },

      removeProject: (id) =>
        set((state) => {
          delete state.projects[id];
          if (state.activeProject.projectId === id) {
            state.activeProject.projectId = null;
            state.activeProject.dashboardId = null;
          }
        }),

      renameProject: (id, name) =>
        set((state) => {
          if (state.projects[id]) {
            state.projects[id].name = name;
          }
        }),

      addDashboardToProject: (projectId, dashboardId) =>
        set((state) => {
          if (state.projects[projectId]) {
            state.projects[projectId].dashboardIds.push(dashboardId);
          }
        }),

      removeDashboardFromProject: (projectId, dashboardId) =>
        set((state) => {
          if (state.projects[projectId]) {
            state.projects[projectId].dashboardIds = state.projects[projectId].dashboardIds.filter(
              (id) => id !== dashboardId,
            );
            if (state.activeProject.dashboardId === dashboardId) {
              state.activeProject.dashboardId = null;
            }
          }
        }),

      setActiveProject: (projectId, dashboardId) =>
        set((state) => {
          state.activeProject.projectId = projectId;
          state.activeProject.dashboardId = dashboardId;
        }),
    })),
    {
      name: 'webbi-projects',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
