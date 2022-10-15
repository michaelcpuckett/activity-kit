import { AP } from 'activitypub-core-types';
export declare function addContext(entity: AP.Entity): AP.Entity & {
  '@context': unknown;
};
