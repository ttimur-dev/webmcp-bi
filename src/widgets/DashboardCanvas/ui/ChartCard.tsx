import { X, GripHorizontal, Pin, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { EChart } from './EChart';
import type { ChartBlock } from '@/shared/types';
import { useProjectStore } from '@/entities/project';
import { ChartConfigPopover } from '@/features/chart-config';
import { useChartData } from '../model/useChartData';

interface Props {
  block: ChartBlock;
}

export function ChartCard({ block }: Props) {
  const removeChartBlock = useProjectStore((s) => s.removeChartBlock);
  const updateChartBlock = useProjectStore((s) => s.updateChartBlock);
  const { option, loading } = useChartData(block);

  const title = block.dimension && block.measure ? `${block.dimension} / ${block.measure}` : 'Untitled';

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeChartBlock(block.id);
  };

  return (
    <div className="duration-card flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm transition-[box-shadow,border-color] ease-in hover:border-primary-glow hover:shadow-card-hover">
      {/* Drag handle / header */}
      <div
        className={cn(
          'drag-handle flex h-8 shrink-0 items-center gap-1 border-b border-border bg-sidebar px-2',
          block.static ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
        )}
      >
        <GripHorizontal className="size-3.5 shrink-0 text-muted-foreground opacity-40" strokeWidth={1.5} />
        <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-foreground/60 select-none">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className={cn('text-muted-foreground', block.static && 'text-primary')}
          onClick={(e) => {
            e.stopPropagation();
            updateChartBlock(block.id, { static: !block.static });
          }}
        >
          <Pin className="size-3" />
        </Button>
        <ChartConfigPopover block={block} />
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="size-3" />
        </Button>
      </div>

      {/* Chart area */}
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
