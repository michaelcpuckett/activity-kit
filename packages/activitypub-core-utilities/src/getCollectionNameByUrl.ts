import { LOCAL_HOSTNAME } from './globals';

export const getCollectionNameByUrl = (url: URL) => {
  const isLocal = url.hostname === LOCAL_HOSTNAME;

  if (!isLocal) {
    return 'foreign-entity';
  }

  return 'entity';

  //const [, collectionName] = url.pathname.split('/'); // TODO

  //return collectionName ?? 'entity';
};
