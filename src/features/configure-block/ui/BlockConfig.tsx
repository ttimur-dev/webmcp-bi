import { Settings2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useDatasetStore } from '@/entities/dataset';
import { useProjectStore } from '@/entities/project';
import type { Block, ChartType } from '@/entities/block';
import type { Aggregation } from '@/shared/lib/duckdb';

interface Props {
  block: Block;
}

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
];

const AGGREGATIONS: { value: Aggregation; label: string }[] = [
  { value: 'SUM', label: 'Sum' },
  { value: 'COUNT', label: 'Count' },
  { value: 'AVG', label: 'Average' },
  { value: 'MIN', label: 'Min' },
  { value: 'MAX', label: 'Max' },
];

export function BlockConfig({ block }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const updateBlock = useProjectStore((s) => s.updateBlock);

  const selectedDataset = datasets.find((d) => d.id === block.datasetId);
  const stringCols = selectedDataset?.columns.filter((c) => c.type === 'string') ?? [];
  const numberCols = selectedDataset?.columns.filter((c) => c.type === 'number') ?? [];

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
            onValueChange={(v) => updateBlock(block.id, { datasetId: v || null, dimension: null, measure: null })}
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
          <Select value={block.chartType} onValueChange={(v) => updateBlock(block.id, { chartType: v as ChartType })}>
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
            onValueChange={(v) => updateBlock(block.id, { dimension: v || null })}
            disabled={stringCols.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column…" />
            </SelectTrigger>
            <SelectContent>
              {stringCols.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Measure (Y)</Label>
          <Select
            value={block.measure ?? ''}
            onValueChange={(v) => updateBlock(block.id, { measure: v || null })}
            disabled={numberCols.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select column…" />
            </SelectTrigger>
            <SelectContent>
              {numberCols.map((c) => (
                <SelectItem key={c.name} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Aggregation</Label>
          <Select
            value={block.aggregation}
            onValueChange={(v) => updateBlock(block.id, { aggregation: v as Aggregation })}
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
