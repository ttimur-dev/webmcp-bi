import { useRef, useState } from 'react';
import { CloudUpload } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shared/ui/dialog';
import { importCsvDataset } from '../lib/import-csv';
import { useDatasetStore } from '@/entities/dataset';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CsvUploadModal({ open, onOpenChange }: Props) {
  const addDataset = useDatasetStore((s) => s.addDataset);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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
    setDragging(true);
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

  const handleSubmit = async () => {
    if (!file || submitting) return;
    setSubmitting(true);
    try {
      const name = title.trim() || file.name.replace(/\.csv$/i, '');
      const dataset = await importCsvDataset(file, name);
      addDataset(dataset);
      handleClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle('');
    setFile(null);
    setDragging(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 overflow-hidden" style={{ width: '480px', maxWidth: '95vw' }}>
        <DialogHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-border">
          <DialogTitle className="text-sm font-semibold">Upload CSV</DialogTitle>
        </DialogHeader>

        <div className="px-4 py-5 flex flex-col gap-3">
          {/* Title field */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Dataset name"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-amber-400 transition-colors placeholder:text-muted-foreground"
          />

          {/* Drop zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors py-12"
            style={{
              borderColor: dragging
                ? 'oklch(0.67 0.16 55)'
                : file
                  ? 'oklch(0.67 0.16 55 / 0.5)'
                  : 'oklch(0.82 0.008 70)',
              background: dragging ? 'oklch(0.67 0.16 55 / 0.05)' : file ? 'oklch(0.67 0.16 55 / 0.03)' : 'transparent',
            }}
          >
            <CloudUpload
              className="w-10 h-10"
              style={{
                color: file ? 'oklch(0.67 0.16 55)' : 'oklch(0.60 0.010 70)',
              }}
              strokeWidth={1.5}
            />
            {file ? (
              <p className="text-sm font-medium text-foreground">{file.name}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Drag & Drop your CSV File or browse</p>
            )}
            <input ref={fileInputRef} type="file" accept=".csv" className="hidden" onChange={handleInputChange} />
          </div>
        </div>

        <DialogFooter className="mx-0 mb-0 px-4 py-3">
          <Button disabled={!file || submitting} onClick={handleSubmit}>
            {submitting ? 'Uploading…' : 'Submit'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
