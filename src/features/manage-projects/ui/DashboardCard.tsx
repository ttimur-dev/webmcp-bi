import { LayoutDashboard, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { Dashboard } from '@/entities/project';

interface Props {
  dashboard: Dashboard;
  isActive: boolean;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onDelete: () => void;
}

export function DashboardCard({ dashboard, isActive, isSelected, onClick, onDoubleClick, onDelete }: Props) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      className={cn(
        'group relative flex flex-col items-center gap-2 rounded-lg border p-3 text-left transition-all cursor-pointer',
        'w-[110px]',
        isSelected ? 'border-primary/40 bg-primary/6' : 'border-border hover:border-border/60 hover:bg-accent',
      )}
    >
      {/* Icon */}
      <div
        className="relative flex h-14 w-14 items-center justify-center rounded-lg"
        style={{
          background: isSelected ? 'var(--primary-bg)' : 'var(--surface-neutral)',
          border: `1px solid ${isSelected ? 'var(--primary-border)' : 'var(--border)'}`,
        }}
      >
        <LayoutDashboard
          className="w-6 h-6"
          style={{
            color: isSelected ? 'var(--primary)' : 'var(--text-subtle)',
          }}
          strokeWidth={1.5}
        />
        {isActive && (
          <div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
            style={{
              background: 'var(--primary)',
              boxShadow: '0 0 5px var(--primary-glow)',
            }}
          />
        )}
      </div>

      {/* Name */}
      <span
        className="w-full truncate text-center text-[11px] font-medium leading-tight"
        style={{
          color: isSelected ? 'var(--secondary-foreground)' : 'var(--text-dimmed)',
        }}
      >
        {dashboard.name}
      </span>

      {/* Block count */}
      <span className="text-[10px] font-mono text-muted-foreground opacity-70">
        {dashboard.blocks.length} block{dashboard.blocks.length !== 1 ? 's' : ''}
      </span>

      {/* Delete button */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-5 w-5"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
    </div>
  );
}
