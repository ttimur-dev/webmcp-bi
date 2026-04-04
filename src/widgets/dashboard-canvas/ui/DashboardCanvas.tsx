import { useMemo, useCallback, useState } from 'react';
import { Plus } from 'lucide-react';
import ReactGridLayout, { useContainerWidth, useResponsiveLayout } from 'react-grid-layout';
import { useDashboardStore } from '@/entities/dashboard';
import { useProjectStore } from '@/entities/project';
import { usePanelStore } from '@/entities/panel';
import { BREAKPOINTS, COLS } from '@/shared/constants';
import { PanelCard } from './PanelCard';
import { useShallow } from 'zustand/react/shallow';
import type { Breakpoint, DashboardLayout, Panel } from '@/shared/types';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface Props {
  onOpenProjects: () => void;
}

export function DashboardCanvas({ onOpenProjects }: Props) {
  const { width, containerRef, mounted } = useContainerWidth();

  const activeDashboardId = useProjectStore((s) => s.activeProject.dashboardId);
  const activeDashboard = useDashboardStore((s) => (activeDashboardId ? s.dashboards[activeDashboardId] : null));
  const updateLayout = useDashboardStore((s) => s.updateLayout);
  const addPanelToDashboard = useDashboardStore((s) => s.addPanelToDashboard);

  const addPanel = usePanelStore((s) => s.addPanel);
  const panels = usePanelStore(
    useShallow((s) => Object.values(s.panels).filter((p) => p.dashboardId === activeDashboardId)),
  );

  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');
  const [layouts, setLayouts] = useState(activeDashboard?.layouts ?? { lg: [] });

  const handleUpdateLayout = useCallback(
    (_: unknown, allLayouts: Partial<Record<Breakpoint, DashboardLayout>>) => {
      if (activeDashboardId) updateLayout(activeDashboardId, allLayouts);
    },
    [activeDashboardId],
  );

  const { layout, cols, setLayoutForBreakpoint } = useResponsiveLayout({
    width,
    breakpoints: BREAKPOINTS,
    cols: COLS,
    layouts,
    onBreakpointChange: setCurrentBreakpoint,
    onLayoutChange: handleUpdateLayout,
  });

  const handleLayoutChange = useCallback(
    (items: DashboardLayout) => {
      setLayouts((prev) => ({ ...prev, [currentBreakpoint]: items }));
    },
    [currentBreakpoint],
  );

  const handleAddPanel = useCallback(() => {
    if (!activeDashboardId) return;

    const id = crypto.randomUUID();
    const newPanel: Panel = {
      id,
      dashboardId: activeDashboardId,
      datasetId: null,
      panelType: 'bar',
      dimension: null,
      measure: null,
      aggregation: 'SUM',
    };

    addPanel(newPanel);
    addPanelToDashboard(activeDashboardId, id);
    setLayoutForBreakpoint(currentBreakpoint, [
      ...(layouts[currentBreakpoint] ?? []),
      { i: id, x: 0, y: 0, w: 6, h: 5 },
    ]);
  }, [layouts, activeDashboardId, currentBreakpoint, addPanel, addPanelToDashboard, setLayoutForBreakpoint]);

  const gridChildren = useMemo(
    () =>
      panels.map((panel) => (
        <div key={panel.id}>
          <PanelCard panel={panel} />
        </div>
      )),
    [panels],
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
        {panels.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <svg className="size-10 opacity-20" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="4" y="20" width="8" height="16" rx="1" />
              <rect x="16" y="12" width="8" height="24" rx="1" />
              <rect x="28" y="6" width="8" height="30" rx="1" />
            </svg>
            <p className="font-mono text-sm text-muted-foreground opacity-60">Add a panel to get started</p>
          </div>
        ) : (
          mounted && (
            <ReactGridLayout
              width={width}
              layout={layout}
              gridConfig={{ cols, rowHeight: 40, containerPadding: [16, 16] }}
              dragConfig={{ enabled: true, handle: '.drag-handle' }}
              onLayoutChange={handleLayoutChange}
            >
              {gridChildren}
            </ReactGridLayout>
          )
        )}
      </div>

      <button
        onClick={handleAddPanel}
        title="Add panel"
        aria-label="Add new panel"
        className="absolute right-5 bottom-5 z-10 flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Plus className="size-5" />
      </button>
    </div>
  );
}
