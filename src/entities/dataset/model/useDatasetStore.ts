import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { importCSV as duckdbImportCSV, dropTable } from '@/shared/lib/duckdb';
import type { Dataset } from '@/shared/types';

interface DatasetStore {
  datasets: Dataset[];
  importDataset: (file: File, name: string) => Promise<Dataset>;
  deleteDataset: (id: string) => Promise<void>;
  recoverDatasets: (tableNames: string[]) => void;
}

export const useDatasetStore = create<DatasetStore>()(
  persist(
    (set, get) => ({
      datasets: [],

      importDataset: async (file, name) => {
        const id = crypto.randomUUID();
        const tableName = `ds_${id.replaceAll('-', '')}`;
        const schema = await duckdbImportCSV(tableName, file);
        const dataset: Dataset = {
          id,
          name,
          tableName,
          columns: schema.columns,
          rowCount: schema.rowCount,
          createdAt: Date.now(),
        };
        set((state) => ({ datasets: [...state.datasets, dataset] }));
        return dataset;
      },

      deleteDataset: async (id) => {
        const dataset = get().datasets.find((d) => d.id === id);
        if (dataset) {
          try {
            await dropTable(dataset.tableName);
          } catch (error) {
            console.error('Failed to drop table:', error);
          }
        }
        set((state) => ({ datasets: state.datasets.filter((d) => d.id !== id) }));
      },

      recoverDatasets: (tableNames) => {
        if (get().datasets.length > 0) return;
        set({
          datasets: tableNames.map((tableName) => ({
            id: tableName,
            name: tableName,
            tableName,
            columns: [],
            rowCount: 0,
            createdAt: Date.now(),
          })),
        });
      },
    }),
    {
      name: 'dataset-store',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
