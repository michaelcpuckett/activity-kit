import { AP } from 'activitypub-core-types';
import { convertStringsToUrls } from 'activitypub-core-utilities';
import { getRecipientsList } from '../src/getRecipientsList';

describe('DeliveryAdapter', () => {
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
              first: actor1FollowingPageUrl,
            };
          }
          if (url === actor1FollowingPageUrl) {
            return {
              id: actor1FollowingPageUrl,
              url: actor1FollowingPageUrl,
              type: AP.CollectionPageTypes.COLLECTION_PAGE,
              name: 'Following Page 1',
              items: [actor2Url],
            };
          }
          return null;
        },
      };
    });

    it('follows collections/collection pages', async () => {
      const result = await getRecipientsList.call(
        {
          databaseAdapter: {
            async queryById(id: URL) {
              console.log(id.toString());
              return convertStringsToUrls(
                (await fetch(id.toString()).then(({ json }) => json())) as {
                  [key: string]: unknown;
                },
              );
            },
          },
        },
        new URL(actor1FollowingUrl),
      );

      expect(result.length).toBe(1);
      expect(result[0].toString()).toBe(actor2Url);
    });
  });
});
