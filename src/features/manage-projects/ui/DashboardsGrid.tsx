import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
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
  const addDashboard = useProjectStore((s) => s.addDashboard);
  const removeDashboard = useProjectStore((s) => s.removeDashboard);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);

  const handleAddConfirm = () => {
    const name = newName.trim();
    if (name && projectId) {
      const id = addDashboard(projectId, name);
      onSelect(id);
    }
    setAdding(false);
    setNewName('');
  };

  if (!projectId) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xs font-mono text-muted-foreground opacity-60">Select a project to see dashboards</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Dashboards</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setAdding(true);
            setTimeout(() => addInputRef.current?.focus(), 0);
          }}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {dashboards.length === 0 && !adding ? (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <p className="text-xs font-mono text-muted-foreground opacity-60">no dashboards yet</p>
            <button
              onClick={() => {
                setAdding(true);
                setTimeout(() => addInputRef.current?.focus(), 0);
              }}
              className="text-xs font-mono text-primary hover:text-primary/70 transition-colors"
            >
              + create one
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 content-start">
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

            {/* Inline add card */}
            {adding && (
              <div
                className="flex flex-col items-center gap-2 rounded-lg border p-3 w-[110px]"
                style={{
                  borderColor: 'var(--primary-border)',
                  background: 'var(--primary-bg-subtle)',
                }}
              >
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-lg"
                  style={{
                    background: 'var(--surface-neutral)',
                    border: '1px solid var(--primary-border)',
                  }}
                >
                  <Plus className="w-5 h-5" style={{ color: 'var(--primary-muted)' }} strokeWidth={1.5} />
                </div>
                <input
                  ref={addInputRef}
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onBlur={handleAddConfirm}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddConfirm();
                    if (e.key === 'Escape') {
                      setAdding(false);
                      setNewName('');
                    }
                  }}
                  placeholder="name…"
                  className="w-full bg-transparent text-xs text-center text-foreground outline-none border-b border-primary/40 placeholder:text-muted-foreground/50"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
