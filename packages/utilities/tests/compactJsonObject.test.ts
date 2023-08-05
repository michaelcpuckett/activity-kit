import 'jasmine';

import { compactJsonObject } from '../src/compactJsonObject';

describe('compactJsonObject', () => {
  it('should compact a JSON object', async () => {
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
});
