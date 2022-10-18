import { AP } from 'activitypub-core-types';
import { getRecipientsList } from '../src/getRecipientsList';

describe('DeliveryService', () => {
  describe('getRecipientsList', () => {
    const actor1FollowingUrl = 'https://test.com/actor/following';
    const actor1FollowingPageUrl = 'https://test.com/actor/following/page/1';
    const actor2Url = 'https://example.com/actor/foo';

    const fetch = jest.fn(async (url) => {
      return {
        json: async () => {
          if (url === actor1FollowingUrl) {
            return {
              id: actor1FollowingUrl,
              url: actor1FollowingUrl,
              type: AP.CollectionTypes.COLLECTION,
              name: 'Following',
              first: actor1FollowingPageUrl
            };
          }
          if (url === actor1FollowingPageUrl) {
            return {
              id: actor1FollowingPageUrl,
              url: actor1FollowingPageUrl,
              type: AP.CollectionPageTypes.COLLECTION_PAGE,
              name: 'Following Page 1',
              items: [
                actor2Url
              ]
            };
          }
          return null;
        }
      }
    });

    it('works', async () => {
      const result = await getRecipientsList.call({
        databaseService: {
          async queryById(id: URL) {
            return await fetch(id.toString()).then(({ json }) => json())
          }
        }
      }, new URL(actor1FollowingUrl));

      expect(result.length).toBe(1);
    });
  });
});
