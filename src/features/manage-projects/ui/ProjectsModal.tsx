import { useEffect, useState } from 'react';
import { FolderOpen } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
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
        className="flex flex-col p-0 gap-0 overflow-hidden"
        style={{ width: '760px', height: '480px', maxWidth: '95vw' }}
        showCloseButton={false}
      >
        {/* Title bar */}
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" style={{ color: 'oklch(0.53 0.165 52)' }} strokeWidth={2} />
            <DialogTitle className="text-sm font-semibold">Projects</DialogTitle>
          </div>
          <div className="flex items-center gap-2">
            {activeProjectId && activeDashboardId && (
              <span className="text-xs font-mono text-muted-foreground opacity-70">
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
        <div className="flex flex-1 min-h-0 overflow-hidden">
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
          <div className="flex-1 min-w-0 bg-card">
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

        <DialogFooter className="mx-0 mb-0 px-4 py-3 shrink-0 flex-row justify-end">
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
