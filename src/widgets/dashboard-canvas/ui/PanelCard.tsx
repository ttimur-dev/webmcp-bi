import { X, GripHorizontal, Loader2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { EChart } from './EChart';
import { useDashboardStore } from '@/entities/dashboard';
import { usePanelStore, usePanelData } from '@/entities/panel';
import { ConfigurationPopover } from '@/features/panel-configuration';
import type { Panel } from '@/shared/types';

interface Props {
  panel: Panel;
}

export function PanelCard({ panel }: Props) {
  const removePanel = usePanelStore((s) => s.removePanel);
  const removePanelFromDashboard = useDashboardStore((s) => s.removePanelFromDashboard);

  const { option, loading } = usePanelData(panel);

  const title = panel.dimension && panel.measure ? `${panel.dimension} / ${panel.measure}` : 'Untitled';

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removePanelFromDashboard(panel.dashboardId, panel.id);
    removePanel(panel.id);
  };

  return (
    <div className="duration-card flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-[box-shadow,border-color] ease-in hover:border-primary-glow hover:shadow-card-hover">
      <div className="drag-handle flex h-8 shrink-0 cursor-grab items-center gap-1 border-b border-border bg-sidebar px-2 active:cursor-grabbing">
        <GripHorizontal className="size-3.5 shrink-0 text-muted-foreground opacity-40" strokeWidth={1.5} />
        <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-foreground/60 select-none">
          {title}
        </span>
        <ConfigurationPopover panel={panel} />
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="size-3" />
        </Button>
      </div>
      <div className="min-h-0 flex-1 p-1.5">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : option ? (
          <EChart option={option} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5">
            <span className="font-mono text-xs text-muted-foreground">configure chart →</span>
          </div>
        )}
      </div>
    </div>
  );
}
