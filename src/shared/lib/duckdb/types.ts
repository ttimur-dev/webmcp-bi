export type Aggregation = 'SUM' | 'COUNT' | 'AVG' | 'MIN' | 'MAX';

export interface QueryRequest {
  tableName: string;
  dimension: string;
  measure: string;
  aggregation: Aggregation;
}

export interface QueryResult {
  labels: string[];
  values: number[];
}

export interface TableColumn {
  name: string;
  type: 'string' | 'number';
}

export interface TableSchema {
  columns: TableColumn[];
  rowCount: number;
}
