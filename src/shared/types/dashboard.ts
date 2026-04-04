import type { Layout } from 'react-grid-layout';

export interface Dashboard {
  id: string;
  projectId: string;
  name: string;
  panelIds: string[];
  layouts: Partial<Record<Breakpoint, DashboardLayout>>;
  createdAt: number;
}

export type Breakpoint = 'lg' | 'md' | 'sm' | 'xs' | 'xxs';

export interface DashboardLayout extends Layout {}
