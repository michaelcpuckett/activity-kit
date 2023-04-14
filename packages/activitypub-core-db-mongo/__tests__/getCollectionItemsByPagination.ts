import { AP } from 'activitypub-core-types';
import { getCollectionItemsByPagination } from '../src/getCollectionItemsByPagination';

describe('MongoDbAdapter', () => {
  describe('getCollectionItemsByPagination', () => {
    afterEach(async () => null); // TODO: Jest hack.

    it('works', async () => {
      const baseUrl = 'https://example.social';
      const bobActorUrl = new URL(`/@bob`, baseUrl);
      const carolActorUrl = new URL(`/@carol`, baseUrl);
      const aliceFollowersUrl = new URL(`/@alice/followers`, baseUrl);
      const aliceFollowersFirstPageUrl = new URL(`${aliceFollowersUrl}/page/1`);
      const aliceFollowersLastPageUrl = new URL(`${aliceFollowersUrl}/page/2`);

      const collectionItems = await getCollectionItemsByPagination.call(
        {
          queryById(id: URL) {
            if (id.toString() === aliceFollowersFirstPageUrl.toString()) {
              return {
                id: aliceFollowersFirstPageUrl,
                url: aliceFollowersFirstPageUrl,
                type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
                next: aliceFollowersLastPageUrl,
                orderedItems: [bobActorUrl],
              };
            } else if (id.toString() === aliceFollowersLastPageUrl.toString()) {
              return {
                id: aliceFollowersLastPageUrl,
                url: aliceFollowersLastPageUrl,
                type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
                orderedItems: [carolActorUrl],
              };
            }
          },
        },
        {
          id: aliceFollowersUrl,
          url: aliceFollowersUrl,
          type: AP.CollectionTypes.ORDERED_COLLECTION,
          first: aliceFollowersFirstPageUrl,
          last: aliceFollowersLastPageUrl,
        },
      );

      expect(collectionItems.length).toBe(2);
    });
  });
});
