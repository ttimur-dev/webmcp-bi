import { Toaster } from '@/shared/ui/sonner';
import { Main } from '@/pages/main';
import { DuckDBProvider } from './providers/DuckDBProvider';

export function App() {
  return (
    <DuckDBProvider>
      <Main />
      <Toaster />
    </DuckDBProvider>
  );
}
