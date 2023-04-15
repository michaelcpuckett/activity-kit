import { getCollectionNameByUrl } from './getCollectionNameByUrl';

export function isLocal(url: URL) {
  return getCollectionNameByUrl(url) !== 'foreignEntity';
}
