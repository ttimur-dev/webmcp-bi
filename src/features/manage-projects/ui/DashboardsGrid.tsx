import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
import { Button } from '@/shared/ui/button';
import { useProjectStore, type Dashboard } from '@/entities/project';
import { DashboardCard } from './DashboardCard';

interface Props {
  projectId: string | null;
  dashboards: Dashboard[];
  selectedDashboardId: string | null;
  activeDashboardId: string | null;
  onSelect: (id: string) => void;
  onOpen: (dashboardId: string) => void;
}

export function DashboardsGrid({
  projectId,
  dashboards,
  selectedDashboardId,
  activeDashboardId,
  onSelect,
  onOpen,
}: Props) {
  const { addDashboard, removeDashboard } = useProjectStore(
    useShallow((s) => ({ addDashboard: s.addDashboard, removeDashboard: s.removeDashboard })),
  );

  const [addingName, setAddingName] = useState<string | null>(null);
  const addInputRef = useRef<HTMLInputElement>(null);

  const startAdd = () => {
    setAddingName('');
    setTimeout(() => addInputRef.current?.focus(), 0);
  };

  const confirmAdd = () => {
    if (addingName?.trim() && projectId) onSelect(addDashboard(projectId, addingName.trim()));
    setAddingName(null);
  };

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-mono text-xs text-muted-foreground opacity-60">Select a project to see dashboards</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Dashboards</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={startAdd}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {dashboards.length === 0 && addingName === null ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="font-mono text-xs text-muted-foreground opacity-60">no dashboards yet</p>
            <button
              onClick={startAdd}
              className="font-mono text-xs text-primary transition-colors hover:text-primary/70"
            >
              + create one
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap content-start gap-3">
            {dashboards.map((dashboard) => (
              <DashboardCard
                key={dashboard.id}
                dashboard={dashboard}
                isActive={activeDashboardId === dashboard.id}
                isSelected={selectedDashboardId === dashboard.id}
                onClick={() => onSelect(dashboard.id)}
                onDoubleClick={() => onOpen(dashboard.id)}
                onDelete={() => {
                  if (selectedDashboardId === dashboard.id) onSelect('');
                  removeDashboard(projectId, dashboard.id);
                }}
              />
            ))}

            {addingName !== null && (
              <div className="flex w-27.5 flex-col items-center gap-2 rounded-lg border border-primary-border bg-primary-bg-subtle p-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-lg border border-primary-border bg-surface-neutral">
                  <Plus className="size-5 text-primary-muted" strokeWidth={1.5} />
                </div>
                <input
                  ref={addInputRef}
                  value={addingName}
                  onChange={(e) => setAddingName(e.target.value)}
                  onBlur={confirmAdd}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') confirmAdd();
                    if (e.key === 'Escape') setAddingName(null);
                  }}
                  placeholder="name…"
                  className="w-full border-b border-primary/40 bg-transparent text-center text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
