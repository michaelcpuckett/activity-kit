import 'jasmine';

import { compactJsonObject } from '../src/compactJsonObject';
import {
  ACTIVITYSTREAMS_CONTEXT,
  CONTEXT_KEY,
  SCHEMA_ORG_CONTEXT,
  W3ID_SECURITY_CONTEXT,
} from '../src/globals';

describe('compactJsonObject', () => {
  it('should maintain JSON-LD object with known contexts', async () => {
    const compacted = await compactJsonObject({
      [CONTEXT_KEY]: ACTIVITYSTREAMS_CONTEXT,
      id: 'https://example.com/',
      type: 'Person',
      name: 'Example',
    });

    expect(compacted).toEqual({
      '@context': {
        '@vocab': ACTIVITYSTREAMS_CONTEXT,
        sec: W3ID_SECURITY_CONTEXT,
        schema: SCHEMA_ORG_CONTEXT,
        id: '@id',
        type: '@type',
      },
      id: 'https://example.com/',
      type: 'Person',
      name: 'Example',
    });
  });

  it('should maintain JSON-LD object with unknown contexts', async () => {
    const compacted = await compactJsonObject({
      '@context': {
        '@vocab': ACTIVITYSTREAMS_CONTEXT,
        changeset: 'http://purl.org/vocab/changeset/schema#',
        id: '@id',
        type: '@type',
      },
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
      'changeset:createdDate': '2021-01-01T00:00:00Z',
    });

    expect(compacted).toEqual({
      '@context': {
        '@vocab': ACTIVITYSTREAMS_CONTEXT,
        sec: W3ID_SECURITY_CONTEXT,
        schema: SCHEMA_ORG_CONTEXT,
        id: '@id',
        type: '@type',
      },
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
      'http://purl.org/vocab/changeset/schema#createdDate':
        '2021-01-01T00:00:00Z',
    });
  });

  it('should compact plain JSON object', async () => {
    const compacted = await compactJsonObject({
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
      image: {
        type: 'Image',
        url: 'https://example.com/image.png',
      },
    });

    expect(compacted).toEqual({
      '@context': {
        '@vocab': ACTIVITYSTREAMS_CONTEXT,
        sec: W3ID_SECURITY_CONTEXT,
        schema: SCHEMA_ORG_CONTEXT,
        id: '@id',
        type: '@type',
      },
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
      image: {
        type: 'Image',
        url: 'https://example.com/image.png',
      },
    });
  });
});
