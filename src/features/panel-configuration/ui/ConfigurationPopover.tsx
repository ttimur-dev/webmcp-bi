import { useMemo } from 'react';
import { Settings2, Type, Hash, Calendar, ToggleLeft } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Label } from '@/shared/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';
import { useDatasetStore } from '@/entities/dataset';
import { usePanelStore } from '@/entities/panel';
import { PANEL_TYPES, AGGREGATIONS } from '@/shared/constants';
import type { Aggregation, ColumnType } from '@/shared/lib/duckdb';
import type { Panel, PanelType } from '@/shared/types';

const COLUMN_TYPE_ICON: Record<ColumnType, React.ReactNode> = {
  string: <Type className="size-3 shrink-0 text-muted-foreground" />,
  number: <Hash className="size-3 shrink-0 text-muted-foreground" />,
  date: <Calendar className="size-3 shrink-0 text-muted-foreground" />,
  boolean: <ToggleLeft className="size-3 shrink-0 text-muted-foreground" />,
};

interface Props {
  panel: Panel;
}

export function ConfigurationPopover({ panel }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const updatePanel = usePanelStore((s) => s.updatePanel);

  const dimensionCols = useMemo(
    () => datasets.find((d) => d.id === panel.datasetId)?.columns ?? [],
    [datasets, panel.datasetId],
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
            value={panel.datasetId ?? ''}
            onValueChange={(v) => updatePanel(panel.id, { datasetId: v || null, dimension: null, measure: null })}
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
          <Select value={panel.panelType} onValueChange={(v) => updatePanel(panel.id, { panelType: v as PanelType })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PANEL_TYPES.map((pt) => (
                <SelectItem key={pt.value} value={pt.value}>
                  {pt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Dimension (X)</Label>
          <Select
            value={panel.dimension ?? ''}
            onValueChange={(v) => updatePanel(panel.id, { dimension: v || null })}
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
            value={panel.measure ?? ''}
            onValueChange={(v) => updatePanel(panel.id, { measure: v || null })}
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
            value={panel.aggregation}
            onValueChange={(v) => updatePanel(panel.id, { aggregation: v as Aggregation })}
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
