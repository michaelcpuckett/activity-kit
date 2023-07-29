declare module 'jsonld/lib/documentLoaders/node' {
  import * as jsonld from 'jsonld';
  export default function (): jsonld.Options.DocLoader['documentLoader'];
}
