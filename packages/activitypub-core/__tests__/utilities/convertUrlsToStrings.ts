import { ACTIVITYSTREAMS_CONTEXT } from '../../src/globals';
import { AP } from 'activitypub-core-types';
import { convertUrlsToStrings } from '../../src/utilities/convertUrlsToStrings';

describe('utilities', () => {
  describe('convertUrlsToStrings', () => {
    const date = new Date('2021-01-01');
    const collection1Url = 'https://test.com/activity/123';
    const item1Url = 'https://test.com/activity/456';
    const item2Url = 'https://test.com/activity/789';
    const collection1: AP.Collection = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(collection1Url),
      url: new URL(collection1Url),
      type: 'Collection',
      totalItems: 1,
      items: [
        new URL(item1Url),
        new URL(item2Url),
      ],
      published: date,
    };
    const collection1Result = {
      "@context": ACTIVITYSTREAMS_CONTEXT,
      id: collection1Url,
      url: collection1Url,
      type: 'Collection',
      totalItems: 1,
      items: [
        item1Url,
        item2Url,
      ],
      published: date.toISOString(),
    };
    it('converts', async () => {
      const result = convertUrlsToStrings(collection1);
      expect(result).toStrictEqual(collection1Result);
    });
  });
});
