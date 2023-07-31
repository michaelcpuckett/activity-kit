import { LOCAL_HOSTNAME } from './globals';

/**
 * Gets the database collection name for a given URL.
 *
 * @returns The collection name.
 */
export const getCollectionNameByUrl = (url: URL) => {
  const isLocal = url.hostname === LOCAL_HOSTNAME;

  if (!isLocal) {
    return 'foreignEntity';
  }

  return 'entity';
};
