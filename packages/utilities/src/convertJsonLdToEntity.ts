import * as AP from '@activity-kit/types';
import * as jsonld from 'jsonld';
// See types/jsonldDocumentLoader.d.ts
import getNodeDocumentLoader from 'jsonld/lib/documentLoaders/node';
import { RemoteDocument, Context } from 'jsonld/jsonld-spec';
import { CONTEXT_DEFINITIONS, DEFAULT_CONTEXT } from './globals';
import { convertJsonToEntity } from './convertJsonToEntity';
import { applyContext } from './applyContext';

/**
 * Converts a JSON-LD object to a compacted ActivityPub entity.
 *
 * First, the JSON-LD object is compacted using the ActivityStreams context.
 * Then, the compacted object is converted to an ActivityPub Entity. Finally,
 * an updated context is applied to the Entity.
 *
 * @note This does follow the rules of JSON-LD compaction, as it utilizes the
 * `jsonld` library to compact the JSON-LD object.
 *
 * @returns The ActivityPub entity.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 *
 * @example
 * ```ts
 * const jsonLd = {
 *   '@context': {
 *     "schema": 'https://schema.org/',
 *     "as": "https://www.w3.org/ns/activitystreams",
 *   },
 *   '@id': 'https://example.com/note/1',
 *   '@type': ['as:Note', 'schema:CreativeWork'],
 *   'schema:PropertyValue': {
 *     'schema:name': 'Location',
 *     'schema:value': 'Earth',
 *   },
 *   'schema:name': 'My First Note',
 *   'ap:summary': 'My First Note',
 * };
 *
 * const entity = await convertJsonLdToEntity(jsonLd);
 *
 * console.log(entity);
 * // {
 * //   '@context': [
 * //     'https://www.w3.org/ns/activitystreams',
 * //     'https://w3id.org/security/v1',
 * //     {
 * //       'schema:PropertyValue': 'https://schema.org/PropertyValue',
 * //       'schema:value': 'https://schema.org/value',
 * //       'schema:name': 'https://schema.org/name',
 * //     },
 * //   ],
 * //   type: 'Person',
 * //   id: 'https://example.com/note/1',
 * //   name: 'My First Note',
 * //   summary: 'My First Note',
 * //   'schema:propertyValue': {
 * //     'schema:name': 'Location',
 * //     'schema:value': 'Earth',
 * //   },
 * // }
 * ```
 */
export async function convertJsonLdToEntity(
  document: jsonld.JsonLdDocument,
): Promise<AP.Entity | null> {
  const ctx = DEFAULT_CONTEXT;
  const result = await jsonld.compact(document, ctx, {
    documentLoader: customLoader,
  });

  const converted = convertJsonToEntity(result);

  if (!converted) {
    return null;
  }

  delete converted['@context'];

  return applyContext(converted);
}

/**
 * Custom document loader for JSON-LD that uses cached contexts.
 *
 * Bundling the contexts saves on the number of requests made when parsing
 * received JSON-LD documents.
 *
 * Based on the JSON-LD library's node document loader.
 *
 * @returns The remote JSON-LD document.
 */
async function customLoader(
  url: string,
  callback: (err: Error, remoteDoc: RemoteDocument) => void,
): Promise<RemoteDocument> {
  const nodeDocumentLoader = getNodeDocumentLoader();

  if (!nodeDocumentLoader) {
    throw new Error('nodeDocumentLoader is not defined');
  }

  const contextUrl = Object.keys(CONTEXT_DEFINITIONS).find(
    (key) => key === url,
  );

  if (contextUrl) {
    return {
      contextUrl: undefined,
      document: {
        '@context': CONTEXT_DEFINITIONS[contextUrl],
      },
      documentUrl: contextUrl,
    };
  }

  return nodeDocumentLoader(url, callback);
}
