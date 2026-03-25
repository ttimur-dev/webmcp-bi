import { useMemo } from 'react';
import { Settings2, Type, Hash, Calendar, ToggleLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useDatasetStore } from '@/entities/dataset';
import { useProjectStore } from '@/entities/project';
import type { ChartBlock, ChartType } from '@/shared/types';
import type { Aggregation, ColumnType } from '@/shared/lib/duckdb';
import { CHART_TYPES, AGGREGATIONS } from '../constants/constants';

const COLUMN_TYPE_ICON: Record<ColumnType, React.ReactNode> = {
  string: <Type className="size-3 shrink-0 text-muted-foreground" />,
  number: <Hash className="size-3 shrink-0 text-muted-foreground" />,
  date: <Calendar className="size-3 shrink-0 text-muted-foreground" />,
  boolean: <ToggleLeft className="size-3 shrink-0 text-muted-foreground" />,
};

interface Props {
  block: ChartBlock;
}

export function ChartConfigPopover({ block }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const updateChartBlock = useProjectStore((s) => s.updateChartBlock);

  const dimensionCols = useMemo(
    () => datasets.find((d) => d.id === block.datasetId)?.columns ?? [],
    [datasets, block.datasetId],
  );
  const measureCols = useMemo(
    () => dimensionCols.filter((c) => c.type === 'number' || c.type === 'boolean'),
    [dimensionCols],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground" onClick={(e) => e.stopPropagation()}>
          <Settings2 />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 space-y-3" side="bottom" align="end">
        <div className="space-y-1">
          <Label>Dataset</Label>
          <Select
            value={block.datasetId ?? ''}
            onValueChange={(v) => updateChartBlock(block.id, { datasetId: v || null, dimension: null, measure: null })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select dataset…" />
            </SelectTrigger>
            <SelectContent>
              {datasets.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Chart type</Label>
          <Select
            value={block.chartType}
            onValueChange={(v) => updateChartBlock(block.id, { chartType: v as ChartType })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHART_TYPES.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Dimension (X)</Label>
          <Select
            value={block.dimension ?? ''}
            onValueChange={(v) => updateChartBlock(block.id, { dimension: v || null })}
            disabled={dimensionCols.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column…" />
            </SelectTrigger>
            <SelectContent>
              {dimensionCols.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="flex items-center gap-1.5">
                    {COLUMN_TYPE_ICON[c.type]}
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Measure (Y)</Label>
          <Select
            value={block.measure ?? ''}
            onValueChange={(v) => updateChartBlock(block.id, { measure: v || null })}
            disabled={measureCols.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column…" />
            </SelectTrigger>
            <SelectContent>
              {measureCols.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  <span className="flex items-center gap-1.5">
                    {COLUMN_TYPE_ICON[c.type]}
                    {c.name}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Aggregation</Label>
          <Select
            value={block.aggregation}
            onValueChange={(v) => updateChartBlock(block.id, { aggregation: v as Aggregation })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {AGGREGATIONS.map((a) => (
                <SelectItem key={a.value} value={a.value}>
                  {a.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}
