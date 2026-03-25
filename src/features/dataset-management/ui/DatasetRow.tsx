import { Sheet, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import type { Dataset } from '@/entities/dataset';

interface Props {
  dataset: Dataset;
  onDelete: () => void;
}

export function DatasetRow({ dataset, onDelete }: Props) {
  const date = new Date(dataset.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/30">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-bg">
        <Sheet className="size-4 text-primary" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold text-foreground">{dataset.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {dataset.rowCount.toLocaleString()} rows · {dataset.columns.length} cols · {date}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        onClick={onDelete}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
