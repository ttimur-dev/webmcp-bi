import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';
import type { QueryRequest, QueryResult, TableSchema, TableColumn } from './types';

let db: duckdb.AsyncDuckDB | null = null;
let conn: duckdb.AsyncDuckDBConnection | null = null;

export async function init(): Promise<void> {
  if (db) return;

  const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
    mvp: {
      mainModule: duckdb_wasm,
      mainWorker: mvp_worker,
    },
    eh: {
      mainModule: duckdb_wasm_eh,
      mainWorker: eh_worker,
    },
  };

  const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);

  const worker = new Worker(bundle.mainWorker!);
  const logger = new duckdb.VoidLogger();
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

  conn = await db.connect();
}

function getConn(): duckdb.AsyncDuckDBConnection {
  if (!conn) throw new Error('DuckDB not initialized. Call init() first.');
  return conn;
}

function getDb(): duckdb.AsyncDuckDB {
  if (!db) throw new Error('DuckDB not initialized. Call init() first.');
  return db;
}

export async function importCSV(tableName: string, file: File): Promise<TableSchema> {
  const instance = getDb();
  const c = getConn();

  await instance.registerFileHandle(tableName, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);

  await c.insertCSVFromPath(tableName, {
    schema: 'main',
    name: tableName,
    create: true,
    header: true,
    detect: true,
  });

  return getSchema(tableName);
}

export async function getSchema(tableName: string): Promise<TableSchema> {
  const c = getConn();

  const descResult = await c.query(`DESCRIBE SELECT * FROM "${tableName}"`);
  const descRows = descResult.toArray().map((r) => r.toJSON());

  const columns: TableColumn[] = descRows.map((row: Record<string, unknown>) => ({
    name: String(row['column_name']),
    type: isNumericDuckDBType(String(row['column_type'])) ? ('number' as const) : ('string' as const),
  }));

  const countResult = await c.query(`SELECT COUNT(*)::INTEGER as cnt FROM "${tableName}"`);
  const rowCount = Number(countResult.toArray()[0]?.toJSON()['cnt'] ?? 0);

  return { columns, rowCount };
}

export async function query(req: QueryRequest): Promise<QueryResult> {
  const c = getConn();
  const { tableName, dimension, measure, aggregation } = req;

  const sql = `
    SELECT "${dimension}" as label, ${aggregation}("${measure}") as value
    FROM "${tableName}"
    GROUP BY "${dimension}"
    ORDER BY value DESC
  `;

  const result = await c.query(sql);
  const rows = result.toArray().map((r) => r.toJSON());

  return {
    labels: rows.map((r: Record<string, unknown>) => String(r['label'] ?? '')),
    values: rows.map((r: Record<string, unknown>) => Number(r['value'] ?? 0)),
  };
}

export async function dropTable(tableName: string): Promise<void> {
  const c = getConn();
  await c.query(`DROP TABLE IF EXISTS "${tableName}"`);
}

function isNumericDuckDBType(type: string): boolean {
  const t = type.toUpperCase();
  return (
    t.includes('INT') ||
    t.includes('FLOAT') ||
    t.includes('DOUBLE') ||
    t.includes('DECIMAL') ||
    t.includes('NUMERIC') ||
    t.includes('REAL') ||
    t.includes('BIGINT') ||
    t.includes('SMALLINT') ||
    t.includes('TINYINT') ||
    t.includes('HUGEINT')
  );
}
