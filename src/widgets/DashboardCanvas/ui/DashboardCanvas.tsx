import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { GridLayout, getCompactor, useContainerWidth } from 'react-grid-layout';
import { useProjectStore } from '@/entities/project';
import { BlockCard } from './BlockCard';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const gridCompactor = getCompactor(null, false, true);

interface Props {
  onOpenProjects: () => void;
}

export function DashboardCanvas({ onOpenProjects }: Props) {
  const { width, containerRef, mounted } = useContainerWidth();

  const activeDashboard = useProjectStore((s) => {
    const p = s.projects.find((p) => p.id === s.activeProjectId);
    return p?.dashboards.find((d) => d.id === s.activeDashboardId) ?? null;
  });

  const addBlock = useProjectStore((s) => s.addBlock);
  const updateLayout = useProjectStore((s) => s.updateLayout);

  const blocks = activeDashboard?.blocks ?? [];

  const layout = useMemo(
    () => blocks.map((b) => ({ i: b.id, x: b.x, y: b.y, w: b.w, h: b.h, static: b.static ?? false })),
    [blocks],
  );

  const gridChildren = useMemo(
    () =>
      blocks.map((block) => (
        <div key={block.id}>
          <BlockCard block={block} />
        </div>
      )),
    [blocks],
  );

  if (!activeDashboard) {
    return (
      <div ref={containerRef} className="dash-canvas flex-1 flex flex-col items-center justify-center gap-4">
        <svg className="w-12 h-12 opacity-20" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="6" y="6" width="15" height="15" rx="2" />
          <rect x="27" y="6" width="15" height="15" rx="2" />
          <rect x="6" y="27" width="15" height="15" rx="2" />
          <rect x="27" y="27" width="15" height="15" rx="2" />
        </svg>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-foreground/50">No dashboard open</p>
          <p className="text-xs font-mono text-muted-foreground opacity-60">Open or create a project to get started</p>
        </div>
        <button
          onClick={onOpenProjects}
          aria-label="Open Projects"
          className="mt-1 px-4 py-1.5 rounded-md text-xs font-medium transition-colors border bg-[var(--primary-bg)] text-primary border-[var(--primary-border)] hover:bg-[var(--primary-bg-subtle)]"
        >
          Open Projects
        </button>
      </div>
    );
  }

  return (
    <div className="dash-canvas flex-1 relative overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 overflow-auto">
        {blocks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg
              className="w-10 h-10 opacity-20"
              viewBox="0 0 40 40"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="4" y="20" width="8" height="16" rx="1" />
              <rect x="16" y="12" width="8" height="24" rx="1" />
              <rect x="28" y="6" width="8" height="30" rx="1" />
            </svg>
            <p className="text-sm font-mono text-muted-foreground opacity-60">Add a chart to get started</p>
          </div>
        ) : (
          mounted && (
            <GridLayout
              width={width}
              layout={layout}
              gridConfig={{ cols: 12, rowHeight: 60, containerPadding: [16, 16] }}
              compactor={gridCompactor}
              dragConfig={{ handle: '.drag-handle' }}
              onLayoutChange={updateLayout}
            >
              {gridChildren}
            </GridLayout>
          )
        )}
      </div>

      <button
        onClick={addBlock}
        title="Add chart"
        aria-label="Add new chart block"
        className="absolute bottom-5 right-5 z-10 flex items-center justify-center w-10 h-10 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 bg-primary text-primary-foreground"
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
