import { Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { useDatasetStore } from '@/entities/dataset';
import { dropTable } from '@/shared/lib/duckdb';
import { removeFile } from '@/shared/lib/opfs';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetModal({ open, onOpenChange }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const removeDataset = useDatasetStore((s) => s.removeDataset);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 overflow-hidden" style={{ width: '480px', maxWidth: '95vw' }}>
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-border">
          <DialogTitle className="text-sm font-semibold">Datasets</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-5 flex flex-col gap-2 max-h-[60vh] overflow-y-auto">
          {datasets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <p className="text-xs font-mono text-muted-foreground">no datasets loaded</p>
              <p className="text-xs text-muted-foreground opacity-60">
                Use the "Import CSV" button in the header to load data
              </p>
            </div>
          ) : (
            datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3.5"
              >
                {/* dot */}
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'oklch(0.67 0.16 55)' }} />

                {/* info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight truncate text-foreground">{dataset.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {dataset.rowCount.toLocaleString()} rows · {dataset.columns.length} cols
                  </p>
                </div>

                {/* delete */}
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  onClick={() => {
                    dropTable(dataset.tableName).catch(() => {});
                    removeFile(`${dataset.tableName}.csv`).catch(() => {});
                    removeDataset(dataset.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
