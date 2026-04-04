import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useProjectStore } from '@/entities/project';
import { useDashboardStore } from '@/entities/dashboard';
import { ProjectsSidebar } from './ProjectsSidebar';
import { DashboardsGrid } from './DashboardsGrid';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectManagementModal({ open, onOpenChange }: Props) {
  const { projectId, dashboardId } = useProjectStore((s) => s.activeProject);
  const projects = useProjectStore(useShallow((s) => Object.values(s.projects)));
  const allDashboards = useDashboardStore((s) => s.dashboards);
  const setActiveProject = useProjectStore((s) => s.setActiveProject);

  const [selProjectId, setSelProjectId] = useState<string | null>(null);
  const [selDashboardId, setSelDashboardId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelProjectId(projectId);
      setSelDashboardId(dashboardId);
    }
  }, [open, projectId, dashboardId]);

  const handleSelectProject = (id: string) => {
    setSelProjectId(id || null);
    setSelDashboardId(null);
  };

  const handleOpen = () => {
    if (selProjectId && selDashboardId) {
      setActiveProject(selProjectId, selDashboardId);
      onOpenChange(false);
    }
  };

  const canOpen = Boolean(selProjectId && selDashboardId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-120 w-190 max-w-[95vw] flex-col gap-0 overflow-hidden p-0"
        showCloseButton={false}
      >
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-primary" strokeWidth={2} />
            <DialogTitle className="text-sm font-semibold">Projects</DialogTitle>
            <DialogDescription className="sr-only">Manage projects and dashboards</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {projectId && dashboardId && (
              <span className="font-mono text-xs text-muted-foreground opacity-70">
                {projects.find((p) => p.id === projectId)?.name}
                {' / '}
                {allDashboards[dashboardId]?.name}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="w-48 shrink-0 border-r border-border">
            <ProjectsSidebar
              projects={projects}
              selectedProjectId={selProjectId}
              activeProjectId={projectId}
              onSelect={handleSelectProject}
            />
          </div>
          <div className="min-w-0 flex-1 bg-card">
            <DashboardsGrid
              projectId={selProjectId}
              selectedDashboardId={selDashboardId}
              activeDashboardId={dashboardId}
              onSelect={setSelDashboardId}
            />
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 shrink-0 flex-row justify-end px-4 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button disabled={!canOpen} onClick={handleOpen}>
            Open
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
