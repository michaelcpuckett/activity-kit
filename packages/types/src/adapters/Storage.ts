import type { File } from 'formidable';

export type StorageAdapter = {
  params?: Record<string, unknown>;
  upload: (this: StorageAdapter, file: File) => Promise<URL>;
};
