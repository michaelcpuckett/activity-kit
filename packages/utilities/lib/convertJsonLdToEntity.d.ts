import * as AP from '@activity-kit/types';
import * as jsonld from 'jsonld';
/**
 * Converts a JSON-LD object to a compacted ActivityPub Entity.
 *
 * First, the JSON-LD object is compacted using the `jsonld` library. It uses
 * the ActivityPub context as the base context and adds the following contexts
 * to it:
 *
 * - https://w3id.org/security/v1 for encryption/signatures
 * - https://schema.org for Mastodon's profile metadata
 *
 * Then, the compacted object is converted to an ActivityPub Entity.
 *
 * @todo An updated context
 * will be applied to the Entity, unless it already has one.
 *
 * @returns The ActivityPub Entity.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 */
export declare function convertJsonLdToEntity(document: jsonld.JsonLdDocument): Promise<AP.Entity | null>;
