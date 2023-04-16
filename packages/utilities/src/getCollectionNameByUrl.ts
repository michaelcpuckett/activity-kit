import { LOCAL_HOSTNAME } from './globals';

export const getCollectionNameByUrl = (url: URL) => {
  const isLocal = url.hostname === LOCAL_HOSTNAME;

  if (!isLocal) {
    return 'foreignEntity';
  }

  return 'entity';
};
