import type { File } from 'formidable';

export type StorageAdapter = {
  params?: { [key: string]: unknown };
  upload: (this: StorageAdapter, file: File) => Promise<URL>;
};
