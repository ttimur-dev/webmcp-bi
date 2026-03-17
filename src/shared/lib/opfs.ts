const DIR_NAME = 'datasets';

async function getDir(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(DIR_NAME, { create: true });
}

export async function saveFile(fileName: string, file: File): Promise<void> {
  const dir = await getDir();
  const handle = await dir.getFileHandle(fileName, { create: true });
  const writable = await handle.createWritable();
  await writable.write(file);
  await writable.close();
}

export async function removeFile(fileName: string): Promise<void> {
  const dir = await getDir();
  await dir.removeEntry(fileName);
}

export async function getFileHandle(fileName: string): Promise<FileSystemFileHandle> {
  const dir = await getDir();
  return dir.getFileHandle(fileName);
}
