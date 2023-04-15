import { StorageAdapter } from 'activitypub-core-types';
import { File } from 'formidable';

export class StorageLayer {
  upload: (file: File) => Promise<URL>;

  constructor({ store }: { store: StorageAdapter }) {
    this.upload = async (file) => await store.upload(file);
  }
}
