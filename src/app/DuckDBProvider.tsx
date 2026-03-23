import { useEffect, useRef, useState, type ReactNode } from 'react';
import { init, getAllTables } from '@/shared/lib/duckdb';
import { useDatasetStore } from '@/entities/dataset';

interface Props {
  children: ReactNode;
}

export function DuckDBProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    init().then(async () => {
      const { datasets, addDataset } = useDatasetStore.getState();

      // Recovery mechanism: dataset metadata lives in localStorage while actual table data
      // is persisted in DuckDB (OPFS). If localStorage is cleared, the metadata is lost but
      // the tables remain. When we detect an empty store, we scan DuckDB for existing tables
      // and create stub entries so the user can see something went wrong and delete the orphaned
      // tables if needed. Stubs have empty columns and rowCount=0 intentionally — this signals
      // that metadata is missing rather than showing silently broken charts.
      if (datasets.length === 0) {
        const tables = await getAllTables();
        for (const tableName of tables) {
          addDataset({
            id: tableName,
            name: tableName,
            tableName,
            columns: [],
            rowCount: 0,
            createdAt: Date.now(),
          });
        }
      }

      setReady(true);
    });
  }, []);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Initializing engine…</p>
      </div>
    );
  }

  return <>{children}</>;
}
