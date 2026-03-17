import type { Aggregation } from '@/shared/lib/duckdb';

export type ChartType = 'bar' | 'line' | 'pie';

export interface Block {
  id: string;
  // layout
  x: number;
  y: number;
  w: number;
  h: number;
  static?: boolean;
  // chart config
  datasetId: string | null;
  chartType: ChartType;
  dimension: string | null;
  measure: string | null;
  aggregation: Aggregation;
}
