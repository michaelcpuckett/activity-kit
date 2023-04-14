import { AP } from 'activitypub-core-types';
import { getRecipientUrls } from '../src/getRecipientUrls';
import { getPaginatedCollectionItems } from '../../activitypub-core-db-mongo/src/getPaginatedCollectionItems';

describe('DeliveryAdapter', () => {
  describe('getRecipientUrls', () => {
    afterEach(async () => null); // TODO: Jest hack.

    it('works', async () => {
      const baseUrl = 'https://example.social';
      const aliceActorUrl = new URL('/@alice', baseUrl);
      const bobActorUrl = new URL(`/@bob`, baseUrl);
      const carolActorUrl = new URL(`/@carol`, baseUrl);
      const aliceFollowersUrl = new URL(`${aliceActorUrl}/followers`);
      const aliceFollowersFirstPageUrl = new URL(`${aliceFollowersUrl}/page/1`);
      const aliceFollowersLastPageUrl = new URL(`${aliceFollowersUrl}/page/2`);

      const collectionItems = await getRecipientUrls.call(
        {
          adapters: {
            db: {
              fetchEntityById(id: URL) {
                if (id.toString() === aliceFollowersUrl.toString()) {
                  return {
                    id: aliceFollowersUrl,
                    url: aliceFollowersUrl,
                    type: AP.CollectionTypes.ORDERED_COLLECTION,
                    first: aliceFollowersFirstPageUrl,
                    last: aliceFollowersLastPageUrl,
                  };
                }

                if (id.toString() === bobActorUrl.toString()) {
                  return {
                    id: bobActorUrl,
                    url: bobActorUrl,
                    type: AP.ActorTypes.PERSON,
                  };
                }

                if (id.toString() === carolActorUrl.toString()) {
                  return {
                    id: carolActorUrl,
                    url: carolActorUrl,
                    type: AP.ActorTypes.PERSON,
                  };
                }
              },
              getPaginatedCollectionItems: async (
                collection: AP.EitherCollection,
              ) => {
                return await getPaginatedCollectionItems.call(
                  {
                    fetchEntityById(id: URL) {
                      if (
                        id.toString() === aliceFollowersFirstPageUrl.toString()
                      ) {
                        return {
                          id: aliceFollowersFirstPageUrl,
                          url: aliceFollowersFirstPageUrl,
                          type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
                          next: aliceFollowersLastPageUrl,
                          orderedItems: [bobActorUrl],
                        };
                      } else if (
                        id.toString() === aliceFollowersLastPageUrl.toString()
                      ) {
                        return {
                          id: aliceFollowersLastPageUrl,
                          url: aliceFollowersLastPageUrl,
                          type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
                          orderedItems: [carolActorUrl],
                        };
                      }
                    },
                  },
                  collection,
                );
              },
            },
          },
        },
        {
          type: AP.ActivityTypes.ARRIVE,
          actor: aliceActorUrl,
          to: [aliceFollowersUrl],
        },
      );

      expect(collectionItems.length).toBe(2);
    });
  });
});
