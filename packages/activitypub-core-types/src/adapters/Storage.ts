import type { File } from 'formidable';

export type StorageAdapter = {
  upload: (this: StorageAdapter, file: File) => Promise<URL>;
};
