import { useState } from 'react';
import { Database, FolderOpen, BarChart2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/shared/ui/button';
import { DataManagementModal } from '@/features/data-management';
import { useDatasetStore } from '@/entities/dataset';
import { useProjectStore } from '@/entities/project';

interface Props {
  onOpenProjects: () => void;
}

export function Header({ onOpenProjects }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);

  const { activeProjectName, activeDashboardName, activeBlockCount } = useProjectStore(
    useShallow((s) => {
      const p = s.projects.find((p) => p.id === s.activeProjectId);
      const d = p?.dashboards.find((d) => d.id === s.activeDashboardId);
      return {
        activeProjectName: p?.name,
        activeDashboardName: d?.name,
        activeBlockCount: d?.blocks.length ?? 0,
      };
    }),
  );

  const [dataManagementOpen, setDataManagementOpen] = useState(false);

  return (
    <header className="app-header flex h-11 shrink-0 items-center gap-1 px-3">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-3 mr-1 border-r border-border">
        <BarChart2 className="w-4 h-4" style={{ color: 'var(--primary)' }} strokeWidth={2.5} />
        <span className="text-sm font-bold select-none text-foreground" style={{ letterSpacing: '0.04em' }}>
          WebMCP BI
        </span>
      </div>

      {/* Projects */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
        onClick={onOpenProjects}
      >
        <FolderOpen className="w-3.5 h-3.5" />
        Projects
      </Button>

      <div className="w-px h-4 bg-border mx-1" />

      {/* Data Management */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
        onClick={() => setDataManagementOpen(true)}
      >
        <Database className="w-3.5 h-3.5" />
        Data
        {datasets.length > 0 && (
          <span
            className="ml-0.5 rounded px-1.5 py-0.5 text-xs font-mono font-semibold"
            style={{
              background: 'var(--primary-bg)',
              color: 'var(--primary)',
            }}
          >
            {datasets.length}
          </span>
        )}
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Active dashboard */}
      <div className="flex items-center gap-1.5">
        <div className="brand-dot" />
        {activeDashboardName ? (
          <button
            className="text-xs font-mono hover:text-foreground transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
            onClick={onOpenProjects}
          >
            <span style={{ color: 'var(--text-subtle)' }}>{activeProjectName}</span>
            <span className="opacity-40 mx-0.5">/</span>
            <span style={{ color: 'var(--primary)' }}>{activeDashboardName}</span>
            <span className="opacity-40 ml-1.5">
              · {activeBlockCount} block{activeBlockCount !== 1 ? 's' : ''}
            </span>
          </button>
        ) : (
          <button
            className="text-xs font-mono text-muted-foreground opacity-60 hover:opacity-90 transition-opacity"
            onClick={onOpenProjects}
          >
            no dashboard
          </button>
        )}
      </div>

      <DataManagementModal open={dataManagementOpen} onOpenChange={setDataManagementOpen} />
    </header>
  );
}
