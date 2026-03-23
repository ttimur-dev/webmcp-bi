import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Dataset } from './types';

interface DatasetStore {
  datasets: Dataset[];
  addDataset: (dataset: Dataset) => void;
  removeDataset: (id: string) => void;
}

export const useDatasetStore = create<DatasetStore>()(
  persist(
    (set) => ({
      datasets: [],
      addDataset: (dataset) => set((state) => ({ datasets: [...state.datasets, dataset] })),
      removeDataset: (id) => set((state) => ({ datasets: state.datasets.filter((d) => d.id !== id) })),
    }),
    {
      name: 'dataset-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
