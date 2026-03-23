import { useEffect, useRef, useState, type ReactNode } from 'react';
import { init, getAllTables } from '@/shared/lib/duckdb';
import { useDatasetStore } from '@/entities/dataset';

interface Props {
  children: ReactNode;
}

export function DuckDBProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    init().then(async () => {
      const { datasets, addDataset } = useDatasetStore.getState();

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
    }).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to initialize DuckDB');
    });
  }, []);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <p className="text-sm font-medium text-destructive">Failed to start</p>
        <p className="text-xs text-muted-foreground max-w-sm text-center">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground animate-pulse">Initializing engine…</p>
      </div>
    );
  }

  return <>{children}</>;
}
