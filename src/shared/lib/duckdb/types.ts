export type Aggregation = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';
export type ColumnType = 'string' | 'number' | 'date' | 'boolean';

export interface QueryRequest {
  tableName: string;
  dimension: string;
  dimensionType: ColumnType;
  measure: string;
  aggregation: Aggregation;
}

export interface QueryResult {
  labels: string[];
  values: number[];
}

export interface TableColumn {
  name: string;
  type: ColumnType;
}

export interface TableSchema {
  columns: TableColumn[];
  rowCount: number;
}
