import { ACTIVITYSTREAMS_CONTEXT } from '../src/globals';
import { AP } from 'activitypub-core-types';
import { convertStringsToUrls } from '../src/convertStringsToUrls';

describe('utilities', () => {
  describe('convertStringsToUrls', () => {
    const date = new Date('2021-01-01');
    const collection1Url = 'https://test.com/entity/123';
    const item1Url = 'https://test.com/entity/456';
    const item2Url = 'https://test.com/entity/789';
    const collection1Result: AP.Collection = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(collection1Url),
      url: new URL(collection1Url),
      type: 'Collection',
      totalItems: 1,
      items: [new URL(item1Url), new URL(item2Url)],
      published: date,
    };
    const collection1 = {
      '@context': ACTIVITYSTREAMS_CONTEXT,
      id: collection1Url,
      url: collection1Url,
      type: 'Collection',
      totalItems: 1,
      items: [item1Url, item2Url],
      published: date.toISOString(),
    };
    const collectionPage = {
      '@context': 'https://www.w3.org/ns/activitystreams',
      id: 'https://mastodon.social/users/mpuckett/followers?page=1',
      type: 'OrderedCollectionPage',
      totalItems: 2,
      partOf: 'https://mastodon.social/users/mpuckett/followers',
      orderedItems: [
        'https://puckett.contact/entity/michael',
        'https://michaelpuckett.engineer/as/actor',
      ],
    };
    const collectionPageResult = {
      '@context': new URL('https://www.w3.org/ns/activitystreams'),
      id: new URL('https://mastodon.social/users/mpuckett/followers?page=1'),
      type: 'OrderedCollectionPage',
      totalItems: 2,
      partOf: new URL('https://mastodon.social/users/mpuckett/followers'),
      orderedItems: [
        new URL('https://puckett.contact/entity/michael'),
        new URL('https://michaelpuckett.engineer/as/actor'),
      ],
    };
    it('converts strings to URLS', async () => {
      const result = convertStringsToUrls(collection1);
      expect(result).toStrictEqual(collection1Result);
    });
    it('handles mastodon collection page', async () => {
      const result = convertStringsToUrls(collectionPage);
      expect(result).toStrictEqual(collectionPageResult);
    });
  });
});
