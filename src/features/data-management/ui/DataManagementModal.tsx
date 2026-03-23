import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { CloudUpload, Database, Sheet, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { useDatasetStore } from '@/entities/dataset';
import { dropTable, importCSV } from '@/shared/lib/duckdb';
import type { Dataset } from '@/entities/dataset';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DataManagementModal({ open, onOpenChange }: Props) {
  const datasets = useDatasetStore((s) => s.datasets);
  const addDataset = useDatasetStore((s) => s.addDataset);
  const removeDataset = useDatasetStore((s) => s.removeDataset);

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
      const id = crypto.randomUUID();
      const tableName = `ds_${id.replaceAll('-', '')}`;
      const schema = await importCSV(tableName, file);
      const dataset: Dataset = {
        id,
        name,
        tableName,
        columns: schema.columns,
        rowCount: schema.rowCount,
        createdAt: Date.now(),
      };
      addDataset(dataset);
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
      <DialogContent
        className="flex flex-col p-0 gap-0 overflow-hidden"
        style={{ width: '540px', maxWidth: '95vw' }}
        showCloseButton={false}
      >
        <DialogHeader className="flex flex-row items-center px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4" style={{ color: 'var(--primary)' }} strokeWidth={2} />
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
            <div className="px-5 py-4 flex flex-col gap-2 min-h-[220px] max-h-[60vh] overflow-y-auto">
              {datasets.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 py-14 gap-1.5">
                  <p className="text-xs font-mono text-muted-foreground">no datasets loaded</p>
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
                  <DatasetRow
                    key={dataset.id}
                    dataset={dataset}
                    onDelete={() => {
                      dropTable(dataset.tableName).catch(console.error);
                      removeDataset(dataset.id);
                    }}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="upload" className="mt-0">
            <div className="px-5 py-5 flex flex-col gap-3">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Dataset name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-amber-400 transition-colors placeholder:text-muted-foreground"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-12"
                style={{
                  borderColor: dragging
                    ? 'var(--accent-upload)'
                    : file
                      ? 'var(--accent-upload-border)'
                      : 'var(--border-light)',
                  background: dragging
                    ? 'var(--accent-upload-bg)'
                    : file
                      ? 'var(--accent-upload-bg-subtle)'
                      : 'transparent',
                }}
              >
                <CloudUpload
                  className="w-10 h-10"
                  style={{ color: file ? 'var(--accent-upload)' : 'var(--icon-placeholder)' }}
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

        <DialogFooter className="mx-0 mb-0 px-4 py-3 shrink-0 flex-row justify-end">
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

function DatasetRow({ dataset, onDelete }: { dataset: Dataset; onDelete: () => void }) {
  const date = new Date(dataset.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group flex items-center gap-3 rounded-xl border border-border px-4 py-3 transition-colors hover:bg-muted/30">
      <div
        className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
        style={{ background: 'var(--primary-bg)' }}
      >
        <Sheet className="w-4 h-4" style={{ color: 'var(--primary)' }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold leading-tight truncate text-foreground">{dataset.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {dataset.rowCount.toLocaleString()} rows · {dataset.columns.length} cols · {date}
        </p>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
        onClick={onDelete}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
