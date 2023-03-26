import type { File } from 'formidable';
export declare type StorageAdapter = {
    upload: (this: StorageAdapter, file: File) => Promise<URL>;
};
