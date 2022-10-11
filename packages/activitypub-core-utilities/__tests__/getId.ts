import { ACTIVITYSTREAMS_CONTEXT } from '../src/globals';
import { AP } from 'activitypub-core-types';
import { getId } from '../src/getId';

describe('utilities', () => {
  describe('getId', () => {
    const collection1Url = 'https://test.com/activity/123';
    const collection1Result: AP.Collection = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(collection1Url),
      url: new URL(collection1Url),
      type: 'Collection',
      totalItems: 1,
      items: [
        new URL('https://test.com/activity/456'),
        new URL('https://test.com/activity/789'),
      ],
    };

    it('gets an ID when provided an ID', async () => {
      const result = getId(new URL(collection1Url));
      expect(result).toStrictEqual(new URL(collection1Url));
    });

    it('gets an ID when provided an Entity', async () => {
      const result = getId(collection1Result);
      expect(result).toStrictEqual(new URL(collection1Url));
    });
  });
});
