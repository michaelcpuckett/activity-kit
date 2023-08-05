import 'jasmine';

import { compactJsonObject } from '../src/compactJsonObject';

describe('compactJsonObject', () => {
  it('should maintain JSON object', async () => {
    const compacted = await compactJsonObject({
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
    });

    expect(compacted).toEqual({
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://example.com',
      type: 'Person',
      name: 'Example',
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
      '@context': 'https://www.w3.org/ns/activitystreams',
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
