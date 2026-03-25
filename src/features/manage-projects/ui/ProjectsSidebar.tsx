import { useState } from 'react';
import { FolderOpen, FolderPlus, Trash2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';
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
  const { addProject, removeProject, renameProject } = useProjectStore(
    useShallow((s) => ({ addProject: s.addProject, removeProject: s.removeProject, renameProject: s.renameProject })),
  );

  const [addingName, setAddingName] = useState<string | null>(null);
  const [renaming, setRenaming] = useState<{ id: string; value: string } | null>(null);

  const confirmAdd = () => {
    if (addingName?.trim()) onSelect(addProject(addingName.trim()));
    setAddingName(null);
  };

  const confirmRename = () => {
    if (renaming?.value.trim()) renameProject(renaming.id, renaming.value.trim());
    setRenaming(null);
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center justify-between border-b border-sidebar-border px-3 py-2.5">
        <span className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">Projects</span>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => setAddingName('')}
        >
          <FolderPlus className="size-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-1">
        {projects.map((project) => (
          <div
            key={project.id}
            className={cn(
              'group flex cursor-pointer items-center gap-2 px-3 py-1.5 transition-colors',
              selectedProjectId === project.id ? 'bg-sidebar-accent' : 'hover:bg-sidebar-accent/60',
            )}
            onClick={() => onSelect(project.id)}
            onDoubleClick={() => setRenaming({ id: project.id, value: project.name })}
          >
            <FolderOpen
              className={cn('size-3.5 shrink-0', activeProjectId === project.id ? 'text-primary' : 'text-text-subtle')}
              strokeWidth={1.5}
            />
            {renaming?.id === project.id ? (
              <input
                autoFocus
                onFocus={(e) => e.target.select()}
                value={renaming.value}
                onChange={(e) => setRenaming({ id: project.id, value: e.target.value })}
                onBlur={confirmRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') confirmRename();
                  if (e.key === 'Escape') setRenaming(null);
                }}
                className="min-w-0 flex-1 border-b border-primary/50 bg-transparent text-xs text-foreground outline-none"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span
                className={cn(
                  'min-w-0 flex-1 truncate text-xs',
                  selectedProjectId === project.id ? 'font-medium text-foreground' : 'text-foreground/70',
                )}
              >
                {project.name}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              className="size-5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedProjectId === project.id) onSelect('');
                removeProject(project.id);
              }}
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        ))}

        {addingName !== null && (
          <div className="flex items-center gap-2 px-3 py-1.5">
            <FolderPlus className="size-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
            <input
              autoFocus
              value={addingName}
              onChange={(e) => setAddingName(e.target.value)}
              onBlur={confirmAdd}
              onKeyDown={(e) => {
                if (e.key === 'Enter') confirmAdd();
                if (e.key === 'Escape') setAddingName(null);
              }}
              placeholder="Project name…"
              className="min-w-0 flex-1 border-b border-primary/40 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/50"
            />
          </div>
        )}

        {projects.length === 0 && addingName === null && (
          <div className="px-3 py-4 text-center">
            <p className="font-mono text-xs text-muted-foreground opacity-60">no projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
