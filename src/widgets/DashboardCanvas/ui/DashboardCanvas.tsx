import { useMemo } from 'react';
import { Plus } from 'lucide-react';
import ReactGridLayout, { useContainerWidth, useResponsiveLayout } from 'react-grid-layout';
import { useProjectStore } from '@/entities/project';
import { ChartCard } from './ChartCard';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface Props {
  onOpenProjects: () => void;
}

export function DashboardCanvas({ onOpenProjects }: Props) {
  const { width, containerRef, mounted } = useContainerWidth();

  const addChartBlock = useProjectStore((s) => s.addChartBlock);
  const updateLayout = useProjectStore((s) => s.updateLayout);

  const activeDashboard = useProjectStore((s) => {
    const p = s.projects.find((p) => p.id === s.activeProjectId);
    return p?.dashboards.find((d) => d.id === s.activeDashboardId) ?? null;
  });

  const blocks = activeDashboard?.blocks ?? [];

  const lgLayout = useMemo(
    () => blocks.map((b) => ({ i: b.id, x: b.x, y: b.y, w: b.w, h: b.h, static: b.static ?? false })),
    [blocks],
  );

  const { layout, cols } = useResponsiveLayout({
    width,
    breakpoints: { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 },
    cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
    layouts: { lg: lgLayout },
  });

  const gridChildren = useMemo(
    () =>
      blocks.map((block) => (
        <div key={block.id}>
          <ChartCard block={block} />
        </div>
      )),
    [blocks],
  );

  if (!activeDashboard) {
    return (
      <div ref={containerRef} className="dash-canvas flex flex-1 flex-col items-center justify-center gap-4">
        <svg className="size-12 opacity-20" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="6" y="6" width="15" height="15" rx="2" />
          <rect x="27" y="6" width="15" height="15" rx="2" />
          <rect x="6" y="27" width="15" height="15" rx="2" />
          <rect x="27" y="27" width="15" height="15" rx="2" />
        </svg>
        <div className="space-y-1 text-center">
          <p className="text-sm font-medium text-foreground/50">No dashboard open</p>
          <p className="font-mono text-xs text-muted-foreground opacity-60">Open or create a project to get started</p>
        </div>
        <button
          onClick={onOpenProjects}
          aria-label="Open Projects"
          className="mt-1 rounded-md border border-primary-border bg-primary-bg px-4 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary-bg-subtle"
        >
          Open Projects
        </button>
      </div>
    );
  }

  return (
    <div className="dash-canvas relative flex-1 overflow-hidden">
      <div ref={containerRef} className="absolute inset-0 overflow-auto">
        {blocks.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg className="size-10 opacity-20" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="20" width="8" height="16" rx="1" />
              <rect x="16" y="12" width="8" height="24" rx="1" />
              <rect x="28" y="6" width="8" height="30" rx="1" />
            </svg>
            <p className="font-mono text-sm text-muted-foreground opacity-60">Add a chart to get started</p>
          </div>
        ) : (
          mounted && (
            <ReactGridLayout
              width={width}
              layout={layout}
              gridConfig={{ cols, rowHeight: 40, containerPadding: [16, 16] }}
              dragConfig={{ enabled: true, handle: '.drag-handle' }}
              onLayoutChange={updateLayout}
            >
              {gridChildren}
            </ReactGridLayout>
          )
        )}
      </div>

      <button
        onClick={addChartBlock}
        title="Add chart"
        aria-label="Add new chart block"
        className="absolute right-5 bottom-5 z-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
