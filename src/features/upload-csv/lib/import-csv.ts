import type { Dataset } from '@/entities/dataset';
import { importCSV } from '@/shared/lib/duckdb';

export async function importCsvDataset(file: File, name: string): Promise<Dataset> {
  const id = crypto.randomUUID();
  const tableName = `ds_${id.replaceAll('-', '')}`;

  const schema = await importCSV(tableName, file);

  return {
    id,
    name,
    tableName,
    columns: schema.columns,
    rowCount: schema.rowCount,
    createdAt: Date.now(),
  };
}
