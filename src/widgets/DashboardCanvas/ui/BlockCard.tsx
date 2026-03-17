import { useEffect, useState } from 'react';
import { X, GripHorizontal, Pin, Loader2 } from 'lucide-react';
import type { EChartsOption } from 'echarts';
import { Button } from '@/shared/ui/button';
import { EChart } from '@/shared/ui/EChart';
import { useDatasetStore } from '@/entities/dataset';
import type { Block } from '@/entities/block';
import { useProjectStore } from '@/entities/project';
import { BlockConfig } from '@/features/configure-block';
import { query } from '@/shared/lib/duckdb';

function useChartData(block: Block) {
  const dataset = useDatasetStore((s) => s.datasets.find((d) => d.id === block.datasetId) ?? null);
  const [option, setOption] = useState<EChartsOption | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dataset || !block.dimension || !block.measure) {
      setOption(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    query({
      tableName: dataset.tableName,
      dimension: block.dimension,
      measure: block.measure,
      aggregation: block.aggregation,
    })
      .then((result) => {
        if (cancelled) return;

        const { labels, values } = result;

        const fmt = (v: unknown) =>
          v == null ? '' : Number(v).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 });

        if (block.chartType === 'pie') {
          setOption({
            tooltip: { trigger: 'item', valueFormatter: fmt },
            series: [
              {
                type: 'pie',
                radius: '70%',
                data: labels.map((name, i) => ({ name, value: values[i] })),
              },
            ],
          });
        } else {
          setOption({
            tooltip: { trigger: 'axis', valueFormatter: fmt },
            xAxis: {
              type: 'category',
              data: labels,
              axisLabel: { rotate: 30 },
            },
            yAxis: { type: 'value', axisLabel: { formatter: fmt } },
            dataZoom: [
              { type: 'inside', xAxisIndex: 0 },
              { type: 'slider', xAxisIndex: 0, height: 20, bottom: 4 },
            ],
            series: [
              {
                name: block.measure ?? undefined,
                type: block.chartType,
                data: values,
              },
            ],
          });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dataset, block.datasetId, block.chartType, block.dimension, block.measure, block.aggregation]);

  return { option, loading };
}

interface Props {
  block: Block;
}

export function BlockCard({ block }: Props) {
  const removeBlock = useProjectStore((s) => s.removeBlock);
  const updateBlock = useProjectStore((s) => s.updateBlock);
  const { option, loading } = useChartData(block);

  const title = block.dimension && block.measure ? `${block.dimension} / ${block.measure}` : 'Untitled';

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeBlock(block.id);
  };

  return (
    <div className="block-card flex h-full flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
      {/* Drag handle / header */}
      <div
        className={`drag-handle flex h-8 shrink-0 items-center gap-1 border-b border-border px-2 ${block.static ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
        style={{ background: 'oklch(0.96 0.005 78)' }}
      >
        <GripHorizontal className="w-3.5 h-3.5 shrink-0 text-muted-foreground opacity-40" strokeWidth={1.5} />
        <span className="min-w-0 flex-1 truncate text-xs font-mono font-medium select-none text-foreground/60">
          {title}
        </span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground"
          style={{
            color: block.static ? 'oklch(0.53 0.165 52)' : undefined,
          }}
          onClick={(e) => {
            e.stopPropagation();
            updateBlock(block.id, { static: !block.static });
          }}
        >
          <Pin className="w-3 h-3" />
        </Button>
        <BlockConfig block={block} />
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Chart area */}
      <div className="min-h-0 flex-1 p-1.5">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : option ? (
          <EChart option={option} />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-1.5">
            <span className="text-xs font-mono text-muted-foreground">configure chart →</span>
          </div>
        )}
      </div>
    </div>
  );
}
