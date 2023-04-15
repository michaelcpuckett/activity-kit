import { StorageAdapter } from 'activitypub-core-types';
import { File } from 'formidable';
export declare class StorageLayer {
    upload: (file: File) => Promise<URL>;
    constructor({ store }: {
        store: StorageAdapter;
    });
}
