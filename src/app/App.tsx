import { useState } from 'react';
import { Header } from '@/widgets/Header';
import { DashboardCanvas } from '@/widgets/DashboardCanvas';
import { ProjectsModal } from '@/features/manage-projects';
import { DuckDBProvider } from './DuckDBProvider';

export function App() {
  const [projectsOpen, setProjectsOpen] = useState(false);

  return (
    <DuckDBProvider>
      <div className="flex h-screen flex-col">
        <Header onOpenProjects={() => setProjectsOpen(true)} />
        <DashboardCanvas onOpenProjects={() => setProjectsOpen(true)} />
        <ProjectsModal open={projectsOpen} onOpenChange={setProjectsOpen} />
      </div>
    </DuckDBProvider>
  );
}
