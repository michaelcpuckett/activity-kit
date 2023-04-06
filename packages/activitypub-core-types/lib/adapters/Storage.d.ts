import type { File } from 'formidable';
export declare type StorageAdapter = {
    params: {
        [key: string]: unknown;
    };
    upload: (this: StorageAdapter, file: File) => Promise<URL>;
};
