import { LayoutDashboard, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { Dashboard } from '@/shared/types';

interface Props {
  dashboard: Dashboard;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
}

export function DashboardCard({ dashboard, isActive, isSelected, onClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 text-left transition-all',
        'w-27.5',
        isSelected ? 'border-primary/40 bg-primary/6' : 'border-border hover:border-border/60 hover:bg-accent',
      )}
    >
      <div
        className={cn(
          'relative flex h-14 w-14 items-center justify-center rounded-lg border',
          isSelected ? 'border-primary-border bg-primary-bg' : 'border-border bg-surface-neutral',
        )}
      >
        <LayoutDashboard className={cn('size-6', isSelected ? 'text-primary' : 'text-text-subtle')} strokeWidth={1.5} />
        {isActive && (
          <div className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary shadow-glow-primary-sm" />
        )}
      </div>
      <span
        className={cn(
          'w-full truncate text-center text-label leading-tight font-medium',
          isSelected ? 'text-secondary-foreground' : 'text-text-dimmed',
        )}
      >
        {dashboard.name}
      </span>
      <span className="font-mono text-2xs text-muted-foreground opacity-70">
        {dashboard.panelIds.length} panel{dashboard.panelIds.length !== 1 ? 's' : ''}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-1 right-1 size-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="size-3" />
      </Button>
    </div>
  );
}
