import { Database, FolderOpen, BarChart2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/shared/ui/button';
import { useDatasetStore } from '@/entities/dataset';
import { useProjectStore } from '@/entities/project';
import { useDashboardStore } from '@/entities/dashboard';

interface Props {
  onOpenProjects: () => void;
  onOpenData: () => void;
}

export function Header({ onOpenProjects, onOpenData }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);

  const { activeProjectName, activeDashboardId } = useProjectStore(
    useShallow((s) => ({
      activeProjectName: s.activeProject.projectId ? s.projects[s.activeProject.projectId]?.name : undefined,
      activeDashboardId: s.activeProject.dashboardId,
    })),
  );

  const { activeDashboardName, activePanelCount } = useDashboardStore(
    useShallow((s) => {
      const d = activeDashboardId ? s.dashboards[activeDashboardId] : undefined;
      return {
        activeDashboardName: d?.name,
        activePanelCount: d?.panelIds.length ?? 0,
      };
    }),
  );

  return (
    <header className="flex h-11 shrink-0 items-center gap-1 border-b border-border bg-surface-header px-3 backdrop-blur">
      {/* Brand */}
      <div className="mr-1 flex items-center gap-2 border-r border-border pr-3">
        <BarChart2 className="size-4 text-primary" strokeWidth={2.5} />
        <span className="text-sm font-bold tracking-[0.04em] text-foreground select-none">WebMCP BI</span>
      </div>

      {/* Projects */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={onOpenProjects}
      >
        <FolderOpen className="size-3.5" />
        Projects
      </Button>

      <div className="mx-1 h-4 w-px bg-border" />

      {/* Data Management */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
        onClick={onOpenData}
      >
        <Database className="size-3.5" />
        Data
        {datasets.length > 0 && (
          <span className="ml-0.5 rounded bg-primary-bg px-1.5 py-0.5 font-mono text-xs font-semibold text-primary">
            {datasets.length}
          </span>
        )}
      </Button>

      <div className="flex-1" />

      {/* Active dashboard */}
      <div className="flex items-center gap-1.5">
        <div className="size-1.75 shrink-0 rounded-full bg-primary shadow-glow-primary" />
        {activeDashboardName ? (
          <button
            className="font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
            onClick={onOpenProjects}
          >
            <span className="text-text-subtle">{activeProjectName}</span>
            <span className="mx-0.5 opacity-40">/</span>
            <span className="text-primary">{activeDashboardName}</span>
            <span className="ml-1.5 opacity-40">
              · {activePanelCount} panel{activePanelCount !== 1 ? 's' : ''}
            </span>
          </button>
        ) : (
          <button
            className="font-mono text-xs text-muted-foreground opacity-60 transition-opacity hover:opacity-90"
            onClick={onOpenProjects}
          >
            no dashboard
          </button>
        )}
      </div>
    </header>
  );
}
