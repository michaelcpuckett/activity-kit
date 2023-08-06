// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/jsonldDocumentLoader.d.ts" />
import getNodeDocumentLoader from 'jsonld/lib/documentLoaders/node';
import * as jsonld from 'jsonld';
import { cast } from '@activity-kit/type-utilities';
import { RemoteDocument } from 'jsonld/jsonld-spec';
import {
  ACTIVITYSTREAMS_CONTEXT,
  CONTEXT_DEFINITIONS,
  SCHEMA_ORG_CONTEXT,
  W3ID_SECURITY_CONTEXT,
} from './globals';

/**
 * Compact a plain JSON object using known JSON-LD contexts, utilizing the
 * {@link jsonld} library. If the JSON object does not have a context, a
 * default context with the known contexts will be applied.
 *
 * @returns The compacted JSON-LD object.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 */
export async function compactJsonObject(
  object: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  let document = { ...object };

  if ('@context' in document) {
    const [expanded] = await jsonld.expand(document, {
      documentLoader: customLoader,
    });

    document = expanded;
  } else {
    document['@context'] = {
      '@vocab': ACTIVITYSTREAMS_CONTEXT,
      sec: W3ID_SECURITY_CONTEXT,
      schema: SCHEMA_ORG_CONTEXT,
      id: '@id',
      type: '@type',
    };
  }

  const result = await jsonld.compact(
    document,
    {
      '@vocab': ACTIVITYSTREAMS_CONTEXT,
      sec: W3ID_SECURITY_CONTEXT,
      schema: SCHEMA_ORG_CONTEXT,
      id: '@id',
      type: '@type',
    },
    {
      documentLoader: customLoader,
    },
  );

  return cast.isPlainObject(result) ?? null;
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
