import * as jsonld from 'jsonld';
import { AP } from '@activity-kit/types';
export declare const convertJsonLdToEntity: (document: jsonld.JsonLdDocument) => Promise<AP.Entity | null>;
