import { useState } from 'react';
import { Database, FileSpreadsheet, FolderOpen, BarChart2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { CsvUploadModal } from '@/features/upload-csv';
import { DatasetModal } from '@/features/manage-datasets';
import { useDatasetStore } from '@/entities/dataset';
import { useProjectStore } from '@/entities/project';

interface Props {
  onOpenProjects: () => void;
}

export function Header({ onOpenProjects }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);

  const activeProjectName = useProjectStore((s) => s.projects.find((p) => p.id === s.activeProjectId)?.name);
  const activeDashboardName = useProjectStore((s) => {
    const p = s.projects.find((p) => p.id === s.activeProjectId);
    return p?.dashboards.find((d) => d.id === s.activeDashboardId)?.name;
  });
  const activeBlockCount = useProjectStore((s) => {
    const p = s.projects.find((p) => p.id === s.activeProjectId);
    return p?.dashboards.find((d) => d.id === s.activeDashboardId)?.blocks.length ?? 0;
  });

  const [datasetsOpen, setDatasetsOpen] = useState(false);
  const [csvOpen, setCsvOpen] = useState(false);

  return (
    <header className="app-header flex h-11 shrink-0 items-center gap-1 px-3">
      {/* Brand */}
      <div className="flex items-center gap-2 pr-3 mr-1 border-r border-border">
        <BarChart2 className="w-4 h-4" style={{ color: 'oklch(0.53 0.165 52)' }} strokeWidth={2.5} />
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

      {/* Datasets */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
        onClick={() => setDatasetsOpen(true)}
      >
        <Database className="w-3.5 h-3.5" />
        Datasets
        {datasets.length > 0 && (
          <span
            className="ml-0.5 rounded px-1.5 py-0.5 text-xs font-mono font-semibold"
            style={{
              background: 'oklch(0.53 0.165 52 / 0.12)',
              color: 'oklch(0.53 0.165 52)',
            }}
          >
            {datasets.length}
          </span>
        )}
      </Button>

      {/* Import CSV */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs font-medium text-muted-foreground hover:text-foreground gap-1.5"
        onClick={() => setCsvOpen(true)}
      >
        <FileSpreadsheet className="w-3.5 h-3.5" />
        Import CSV
      </Button>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Active dashboard */}
      <div className="flex items-center gap-1.5">
        <div className="brand-dot" />
        {activeDashboardName ? (
          <button
            className="text-xs font-mono hover:text-foreground transition-colors"
            style={{ color: 'oklch(0.50 0.010 65)' }}
            onClick={onOpenProjects}
          >
            <span style={{ color: 'oklch(0.58 0.010 68)' }}>{activeProjectName}</span>
            <span className="opacity-40 mx-0.5">/</span>
            <span style={{ color: 'oklch(0.53 0.165 52)' }}>{activeDashboardName}</span>
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

      <CsvUploadModal open={csvOpen} onOpenChange={setCsvOpen} />
      <DatasetModal open={datasetsOpen} onOpenChange={setDatasetsOpen} />
    </header>
  );
}
