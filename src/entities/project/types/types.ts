import type { ChartBlock } from '@/shared/types';

export interface Dashboard {
  id: string;
  name: string;
  blocks: ChartBlock[];
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  dashboards: Dashboard[];
  createdAt: number;
}
