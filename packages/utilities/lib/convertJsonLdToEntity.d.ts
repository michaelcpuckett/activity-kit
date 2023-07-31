import * as AP from '@activity-kit/types';
import * as jsonld from 'jsonld';
export declare const convertJsonLdToEntity: (document: jsonld.JsonLdDocument) => Promise<AP.Entity | null>;
