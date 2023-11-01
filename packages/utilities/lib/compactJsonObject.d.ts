/// <reference path="../types/jsonldDocumentLoader.d.ts" />
/**
 * Compact a plain JSON object using known JSON-LD contexts, utilizing the
 * {@link jsonld} library. If the JSON object does not have a context, a
 * default context with the known contexts will be applied.
 *
 * @returns The compacted JSON-LD object.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 */
export declare function compactJsonObject(object: Record<string, unknown>): Promise<Record<string, unknown> | null>;
