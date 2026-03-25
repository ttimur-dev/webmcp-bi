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

    init()
      .then(async () => {
        const tables = await getAllTables();
        useDatasetStore.getState().recoverDatasets(tables);
        setReady(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to initialize DuckDB');
      });
  }, []);

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-2">
        <p className="text-sm font-medium text-destructive">Failed to start</p>
        <p className="max-w-sm text-center text-xs text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="animate-pulse text-sm text-muted-foreground">Initializing engine…</p>
      </div>
    );
  }

  return <>{children}</>;
}
