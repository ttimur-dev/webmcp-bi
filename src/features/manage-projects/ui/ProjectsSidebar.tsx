import { useRef, useState } from 'react';
import { FolderOpen, FolderPlus, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { cn } from '@/shared/lib/utils';
import { useProjectStore, type Project } from '@/entities/project';

interface Props {
  projects: Project[];
  selectedProjectId: string | null;
  activeProjectId: string | null;
  onSelect: (id: string) => void;
}

export function ProjectsSidebar({ projects, selectedProjectId, activeProjectId, onSelect }: Props) {
  const addProject = useProjectStore((s) => s.addProject);
  const removeProject = useProjectStore((s) => s.removeProject);
  const renameProject = useProjectStore((s) => s.renameProject);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const addInputRef = useRef<HTMLInputElement>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const handleAddConfirm = () => {
    const name = newName.trim();
    if (name) {
      const id = addProject(name);
      onSelect(id);
    }
    setAdding(false);
    setNewName('');
  };

  const handleStartRename = (project: Project) => {
    setRenamingId(project.id);
    setRenameValue(project.name);
    setTimeout(() => renameInputRef.current?.select(), 0);
  };

  const handleRenameConfirm = () => {
    if (renamingId && renameValue.trim()) {
      renameProject(renamingId, renameValue.trim());
    }
    setRenamingId(null);
    setRenameValue('');
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-sidebar-border">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Projects</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => {
            setAdding(true);
            setTimeout(() => addInputRef.current?.focus(), 0);
          }}
        >
          <FolderPlus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-1">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              'group flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-colors',
              selectedProjectId === project.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/60',
            )}
            onClick={() => onSelect(project.id)}
            onDoubleClick={() => handleStartRename(project)}
          >
            <FolderOpen
              className="w-3.5 h-3.5 shrink-0"
              style={{
                color: activeProjectId === project.id ? 'var(--primary)' : 'var(--text-subtle)',
              }}
              strokeWidth={1.5}
            />
            {renamingId === project.id ? (
              <input
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onBlur={handleRenameConfirm}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameConfirm();
                  if (e.key === 'Escape') setRenamingId(null);
                }}
                className="flex-1 min-w-0 bg-transparent text-xs outline-none border-b border-primary/50 text-foreground"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={cn(
                  'flex-1 min-w-0 truncate text-xs',
                  selectedProjectId === project.id ? 'text-foreground font-medium' : 'text-foreground/70',
                )}
              >
                {project.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity h-5 w-5"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedProjectId === project.id) onSelect('');
                removeProject(project.id);
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* Inline add input */}
        {adding && (
          <div className="flex items-center gap-2 px-3 py-1.5">
            <FolderPlus className="w-3.5 h-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
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
              placeholder="Project name…"
              className="flex-1 min-w-0 bg-transparent text-xs outline-none border-b border-primary/40 placeholder:text-muted-foreground/50 text-foreground"
            />
          </div>
        )}

        {projects.length === 0 && !adding && (
          <div className="px-3 py-4 text-center">
            <p className="text-xs font-mono text-muted-foreground opacity-60">no projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
