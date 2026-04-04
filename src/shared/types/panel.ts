import type { Aggregation } from '@/shared/lib/duckdb';

export type PanelType = 'bar' | 'line' | 'pie';

export interface Panel {
  id: string;
  dashboardId: string;
  datasetId: string | null;
  panelType: PanelType;
  dimension: string | null;
  measure: string | null;
  aggregation: Aggregation;
}
