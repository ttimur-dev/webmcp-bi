import { useEffect, useRef, useState, type ReactNode } from 'react';
import { init } from '@/shared/lib/duckdb';

interface Props {
  children: ReactNode;
}

export function DuckDBProvider({ children }: Props) {
  const [ready, setReady] = useState(false);
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    init().then(() => setReady(true));
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
