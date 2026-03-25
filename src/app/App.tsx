import { Toaster } from '@/shared/ui/sonner';
import { DashboardView } from '@/views/dashboard';
import { DuckDBProvider } from './providers/DuckDBProvider';

export function App() {
  return (
    <DuckDBProvider>
      <DashboardView />
      <Toaster />
    </DuckDBProvider>
  );
}
