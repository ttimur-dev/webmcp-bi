import { useEffect, useRef, useState, type ReactNode } from 'react';
import { init, importCSV } from '@/shared/lib/duckdb';
import { useDatasetStore } from '@/entities/dataset';
import { getFileHandle } from '@/shared/lib/opfs';

interface Props {
  children: ReactNode;
}

export function DuckDBProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    async function setup() {
      await new Promise<void>((resolve) => {
        if (useDatasetStore.persist.hasHydrated()) {
          resolve();
        } else {
          const unsub = useDatasetStore.persist.onFinishHydration(() => {
            resolve();
          });
          unsub();
        }
      });

      await init();

      const datasets = useDatasetStore.getState().datasets;
      await Promise.all(
        datasets.map(async (dataset) => {
          try {
            const handle = await getFileHandle(`${dataset.tableName}.csv`);
            const file = await handle.getFile();
            await importCSV(dataset.tableName, file);
          } catch {
            console.warn(`[DuckDBProvider] Could not restore table for "${dataset.name}"`);
          }
        }),
      );

      setReady(true);
    }

    setup();
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
