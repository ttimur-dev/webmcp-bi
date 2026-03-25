import { useState } from 'react';
import { Header } from '@/widgets/Header';
import { DashboardCanvas } from '@/widgets/DashboardCanvas';
import { ProjectsModal } from '@/features/manage-projects';
import { DatasetManagerModal } from '@/features/dataset-management';

export function DashboardView() {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col">
      <Header onOpenProjects={() => setProjectsOpen(true)} onOpenData={() => setDataOpen(true)} />
      <DashboardCanvas onOpenProjects={() => setProjectsOpen(true)} />
      <ProjectsModal open={projectsOpen} onOpenChange={setProjectsOpen} />
      <DatasetManagerModal open={dataOpen} onOpenChange={setDataOpen} />
    </div>
  );
}
