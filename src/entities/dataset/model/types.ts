import type { ColumnType } from '@/shared/lib/duckdb';

export interface DatasetColumn {
  name: string;
  type: ColumnType;
}

export interface Dataset {
  id: string;
  name: string;
  tableName: string;
  columns: DatasetColumn[];
  rowCount: number;
  createdAt: number;
}
