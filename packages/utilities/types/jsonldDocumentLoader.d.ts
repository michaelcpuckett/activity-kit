/**
 * This file is used to declare the jsonldDocumentLoader module used in
 * convertJsonLdToEntity.ts.
 */
declare module 'jsonld/lib/documentLoaders/node' {
  import * as jsonld from 'jsonld';
  export default function (): jsonld.Options.DocLoader['documentLoader'];
}
