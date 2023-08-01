import * as AP from '@activity-kit/types';
import * as jsonld from 'jsonld';
// See types/jsonldDocumentLoader.d.ts
import getNodeDocumentLoader from 'jsonld/lib/documentLoaders/node';
import { RemoteDocument } from 'jsonld/jsonld-spec';
import { ACTIVITYSTREAMS_CONTEXT, CONTEXT_DEFINITIONS } from './globals';
import { convertJsonToEntity } from './convertJsonToEntity';
import { applyContext } from './applyContext';

/**
 * Converts a JSON object to an ActivityPub entity.
 *
 * @returns The ActivityPub entity.
 */
export async function convertJsonLdToEntity(
  document: jsonld.JsonLdDocument,
): Promise<AP.Entity | null> {
  const ctx = CONTEXT_DEFINITIONS[ACTIVITYSTREAMS_CONTEXT];
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
