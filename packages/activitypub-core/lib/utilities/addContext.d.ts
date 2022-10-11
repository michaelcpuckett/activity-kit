import { AP } from 'activitypub-core-types/src';
export declare function addContext(entity: AP.Entity): AP.Entity & {
    '@context': unknown;
};
