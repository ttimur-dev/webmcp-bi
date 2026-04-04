import { useState } from 'react';
import { Header } from '@/widgets/header';
import { DashboardCanvas } from '@/widgets/dashboard-canvas';
import { ProjectManagementModal } from '@/features/project-management';
import { DatasetManagementModal } from '@/features/dataset-management';
import { useProjectStore } from '@/entities/project';

export function Main() {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [dataOpen, setDataOpen] = useState(false);
  const activeDashboardId = useProjectStore((s) => s.activeProject.dashboardId);

  return (
    <div className="flex h-screen flex-col">
      <Header onOpenProjects={() => setProjectsOpen(true)} onOpenData={() => setDataOpen(true)} />
      <DashboardCanvas key={activeDashboardId} onOpenProjects={() => setProjectsOpen(true)} />
      <ProjectManagementModal open={projectsOpen} onOpenChange={setProjectsOpen} />
      <DatasetManagementModal open={dataOpen} onOpenChange={setDataOpen} />
    </div>
  );
}
