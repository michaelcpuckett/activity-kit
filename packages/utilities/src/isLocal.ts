import { getCollectionNameByUrl } from './getCollectionNameByUrl';

/**
 * Determines whether a URL is local or not.
 *
 * @returns True if local, false if foreign.
 */
export function isLocal(url: URL) {
  return getCollectionNameByUrl(url) !== 'foreignEntity';
}
