import type { Block } from '@/shared/model';

export interface Dashboard {
  id: string;
  name: string;
  blocks: Block[];
  createdAt: number;
}

export interface Project {
  id: string;
  name: string;
  dashboards: Dashboard[];
  createdAt: number;
}
