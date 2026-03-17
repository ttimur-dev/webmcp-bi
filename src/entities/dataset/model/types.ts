export interface DatasetColumn {
  name: string;
  type: 'string' | 'number';
}

export interface Dataset {
  id: string;
  name: string;
  tableName: string;
  columns: DatasetColumn[];
  rowCount: number;
  createdAt: number;
}
