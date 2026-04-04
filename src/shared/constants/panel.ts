import type { PanelType } from '@/shared/types';
import type { Aggregation } from '@/shared/lib/duckdb';

export const PANEL_TYPES: { value: PanelType; label: string }[] = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'pie', label: 'Pie' },
];

export const AGGREGATIONS: { value: Aggregation; label: string }[] = [
  { value: 'SUM', label: 'Sum' },
  { value: 'COUNT', label: 'Count' },
  { value: 'AVG', label: 'Average' },
  { value: 'MIN', label: 'Min' },
  { value: 'MAX', label: 'Max' },
];
