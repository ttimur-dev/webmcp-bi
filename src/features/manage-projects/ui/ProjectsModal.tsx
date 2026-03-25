import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useProjectStore } from '@/entities/project';
import { ProjectsSidebar } from './ProjectsSidebar';
import { DashboardsGrid } from './DashboardsGrid';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectsModal({ open, onOpenChange }: Props) {
  const projects = useProjectStore((s) => s.projects);
  const activeProjectId = useProjectStore((s) => s.activeProjectId);
  const activeDashboardId = useProjectStore((s) => s.activeDashboardId);
  const setActive = useProjectStore((s) => s.setActive);

  const [selProjectId, setSelProjectId] = useState<string | null>(null);
  const [selDashboardId, setSelDashboardId] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setSelProjectId(activeProjectId);
      setSelDashboardId(activeDashboardId);
    }
  }, [open, activeProjectId, activeDashboardId]);

  const selectedProject = projects.find((p) => p.id === selProjectId) ?? null;

  const handleSelectProject = (id: string) => {
    setSelProjectId(id || null);
    setSelDashboardId(null);
  };

  const handleOpen = () => {
    if (selProjectId && selDashboardId) {
      setActive(selProjectId, selDashboardId);
      onOpenChange(false);
    }
  };

  const handleOpenDashboard = (dashboardId: string) => {
    if (selProjectId) {
      setActive(selProjectId, dashboardId);
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
        {/* Title bar */}
        <DialogHeader className="flex shrink-0 flex-row items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <FolderOpen className="size-4 text-primary" strokeWidth={2} />
            <DialogTitle className="text-sm font-semibold">Projects</DialogTitle>
            <DialogDescription className="sr-only">Manage projects and dashboards</DialogDescription>
          </div>
          <div className="flex items-center gap-2">
            {activeProjectId && activeDashboardId && (
              <span className="font-mono text-xs text-muted-foreground opacity-70">
                {projects.find((p) => p.id === activeProjectId)?.name}
                {' / '}
                {
                  projects.find((p) => p.id === activeProjectId)?.dashboards.find((d) => d.id === activeDashboardId)
                    ?.name
                }
              </span>
            )}
          </div>
        </DialogHeader>

        {/* Two-pane body */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          {/* Left: project sidebar */}
          <div className="w-48 shrink-0 border-r border-border">
            <ProjectsSidebar
              projects={projects}
              selectedProjectId={selProjectId}
              activeProjectId={activeProjectId}
              onSelect={handleSelectProject}
            />
          </div>

          {/* Right: dashboards grid */}
          <div className="min-w-0 flex-1 bg-card">
            <DashboardsGrid
              projectId={selProjectId}
              dashboards={selectedProject?.dashboards ?? []}
              selectedDashboardId={selDashboardId}
              activeDashboardId={activeDashboardId}
              onSelect={setSelDashboardId}
              onOpen={handleOpenDashboard}
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
