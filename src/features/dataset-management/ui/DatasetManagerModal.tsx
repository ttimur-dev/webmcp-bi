import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CloudUpload, Database } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useDatasetStore } from '@/entities/dataset';
import { DatasetRow } from './DatasetRow';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DatasetManagerModal({ open, onOpenChange }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const importDataset = useDatasetStore((s) => s.importDataset);
  const deleteDataset = useDatasetStore((s) => s.deleteDataset);

  const [tab, setTab] = useState('datasets');
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selected: File) => {
    setFile(selected);
    if (!title) setTitle(selected.name.replace(/\.csv$/i, ''));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragging) setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f && f.name.toLowerCase().endsWith('.csv')) handleFileSelect(f);
  };

  const handleUpload = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    try {
      const name = title.trim() || file.name.replace(/\.csv$/i, '');
      await importDataset(file, name);
      resetUpload();
      setTab('datasets');
    } catch (error) {
      toast.error('Failed to import CSV', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const resetUpload = () => {
    setTitle('');
    setFile(null);
    setDragging(false);
  };

  const handleClose = () => {
    resetUpload();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex w-135 max-w-[95vw] flex-col gap-0 overflow-hidden p-0" showCloseButton={false}>
        <DialogHeader className="flex shrink-0 flex-row items-center border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-primary" strokeWidth={2} />
            <DialogTitle className="text-sm font-semibold">Data Management</DialogTitle>
            <DialogDescription className="sr-only">Upload and manage datasets</DialogDescription>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList variant="line" className="w-full border-b px-5">
            <TabsTrigger value="datasets">My Datasets</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
          </TabsList>

          <TabsContent value="datasets" className="mt-0">
            <div className="flex max-h-[60vh] min-h-55 flex-col gap-2 overflow-y-auto px-5 py-4">
              {datasets.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-14">
                  <p className="font-mono text-xs text-muted-foreground">no datasets loaded</p>
                  <p className="text-xs text-muted-foreground opacity-60">
                    Switch to{' '}
                    <button
                      className="underline underline-offset-2 transition-opacity hover:opacity-80"
                      onClick={() => setTab('upload')}
                    >
                      Upload New
                    </button>{' '}
                    to import a CSV
                  </p>
                </div>
              ) : (
                datasets.map((dataset) => (
                  <DatasetRow key={dataset.id} dataset={dataset} onDelete={() => deleteDataset(dataset.id)} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="flex flex-col gap-3 px-5 py-5">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dataset name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus:border-primary"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  'relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 transition-colors',
                  dragging
                    ? 'border-accent-upload bg-accent-upload-bg'
                    : file
                      ? 'border-accent-upload-border bg-accent-upload-bg-subtle'
                      : 'border-border-light bg-transparent',
                )}
              >
                <CloudUpload
                  className={cn('size-10', file ? 'text-accent-upload' : 'text-icon-placeholder')}
                  strokeWidth={1.5}
                />
                {file ? (
                  <p className="text-sm font-medium text-foreground">{file.name}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">Drag & drop your CSV file or browse</p>
                )}
                <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleInputChange} />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mx-0 mb-0 shrink-0 flex-row justify-end px-4 py-3">
          {tab === 'datasets' ? (
            <Button variant="ghost" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                onClick={() => {
                  resetUpload();
                  setTab('datasets');
                }}
              >
                Cancel
              </Button>
              <Button disabled={!file || submitting} onClick={handleUpload}>
                {submitting ? 'Uploading…' : 'Upload'}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
