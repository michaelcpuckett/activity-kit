import 'jasmine';
import { respond } from '../../src/entity/respond';
import { actor1, actor1Documents, actor1DocumentsId, actor1Examples, actor1ExamplesId, actor1Id, example1, example1Id, example2, example2Id } from '../../test_data';
import { ACTIVITYSTREAMS_CONTENT_TYPE, LOCAL_DOMAIN, LOCAL_HOSTNAME } from 'activitypub-core-utilities';
import { AP, assertIsApEntity, assertIsArray } from 'activitypub-core-types';

describe('Entity', () => {

  // TODO: Sort, limit, current

  describe('Respond', () => {
    let returnedEntity: AP.Entity|null = null;
    let returnedCollection: AP.Collection|AP.OrderedCollection|null = null;
    let returnedCollectionPage: AP.CollectionPage|AP.OrderedCollectionPage|null = null;
    let returnedSortedCollectionPage: AP.CollectionPage|AP.OrderedCollectionPage|null = null;
    let returnedCurrentSortedCollectionPage: AP.CollectionPage|AP.OrderedCollectionPage|null = null;

    it('Responds to entity with AS content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
          },
        },
        url: new URL(actor1Id),
        async handleFoundEntity(render: Function, entity: AP.Entity) {
          returnedEntity = entity;
        },
        res: {
          setHeader() {
            
          },
        },
        adapters: {
          auth: {
            getUserIdByToken() {
            },
          },
          db: {
            getActorByUserId() {

            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1Id) {
                return actor1;
              }
            }
          }
        }
      });

      expect(returnedEntity?.id?.toString()).toBe(actor1Id);
    });

    it('Responds to collection with AS content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
          },
        },
        url: new URL(actor1ExamplesId),
        handleFoundEntity(render: Function, collection: AP.Collection) {
          returnedCollection = collection;
        },
        res: {
          setHeader() {
            
          },
        },
        adapters: {
          auth: {
            getUserIdByToken() {

            },
          },
          db: {
            getActorByUserId() {

            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1ExamplesId) {
                return actor1Examples;
              }
            }
          }
        }
      });

      expect(returnedCollection?.id?.toString()).toBe(actor1ExamplesId);
      expect(returnedCollection?.items).toBeFalsy();
    });

    it('Responds to collectionPage with AS content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
          },
        },
        url: new URL(`${actor1ExamplesId}?page=1`),
        handleFoundEntity(render: Function, collectionPage: AP.CollectionPage) {
          returnedCollectionPage = collectionPage;
        },
        res: {
          setHeader() {
            
          },
        },
        adapters: {
          auth: {
            getUserIdByToken() {

            },
          },
          db: {
            getActorByUserId() {

            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1ExamplesId) {
                return actor1Examples;
              }

              if (entityId?.toString() === example1Id) {
                return example1;
              }
            }
          }
        }
      });

      expect(returnedCollectionPage?.id?.toString()).toBe(`${actor1ExamplesId}?page=1`);
      expect(Array.isArray(returnedCollectionPage?.items)).toBeTruthy();
      
      assertIsArray(returnedCollectionPage?.items);
      
      expect(returnedCollectionPage.items.length).toBe(1);
    });

    it('Responds to sorted collectionPage with AS content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
          },
        },
        url: new URL(`${actor1DocumentsId}?page=1&sort=name`),
        handleFoundEntity(render: Function, collectionPage: AP.CollectionPage) {
          returnedSortedCollectionPage = collectionPage;
        },
        res: {
          setHeader() {
            
          },
        },
        adapters: {
          auth: {
            getUserIdByToken() {

            },
          },
          db: {
            getActorByUserId() {

            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1DocumentsId) {
                return actor1Documents;
              }

              if (entityId?.toString() === example1Id) {
                return example1;
              }

              if (entityId?.toString() === example2Id) {
                return example2;
              }
            }
          }
        }
      });

      expect(returnedSortedCollectionPage?.id?.toString()).toBe(`${actor1DocumentsId}?page=1&sort=name`);
      expect(Array.isArray(returnedSortedCollectionPage?.items)).toBeTruthy();
      
      assertIsArray(returnedSortedCollectionPage?.items);
      
      expect(returnedSortedCollectionPage.items.length).toBe(2);

      const [
        item1,
        item2,
      ] = returnedSortedCollectionPage.items;

      assertIsApEntity(item1);
      assertIsApEntity(item2);

      expect(item1.id?.toString()).toBe(example2Id);
      expect(item2.id?.toString()).toBe(example1Id);
    });

    it('Responds to current (reversed) sorted collectionPage with AS content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
          },
        },
        url: new URL(`${actor1DocumentsId}?page=1&current&sort=name`),
        handleFoundEntity(render: Function, collectionPage: AP.CollectionPage) {
          returnedCurrentSortedCollectionPage = collectionPage;
        },
        res: {
          setHeader() {
            
          },
        },
        adapters: {
          auth: {
            getUserIdByToken() {

            },
          },
          db: {
            getActorByUserId() {

            },
            findEntityById(entityId: URL) {
              if (entityId?.toString() === actor1DocumentsId) {
                return actor1Documents;
              }

              if (entityId?.toString() === example1Id) {
                return example1;
              }

              if (entityId?.toString() === example2Id) {
                return example2;
              }
            }
          }
        }
      });

      expect(returnedCurrentSortedCollectionPage?.id?.toString()).toBe(`${actor1DocumentsId}?page=1&current&sort=name`);
      expect(Array.isArray(returnedCurrentSortedCollectionPage?.items)).toBeTruthy();
      
      assertIsArray(returnedCurrentSortedCollectionPage?.items);
      
      expect(returnedCurrentSortedCollectionPage.items.length).toBe(2);

      const [
        item1,
        item2,
      ] = returnedCurrentSortedCollectionPage.items;

      assertIsApEntity(item1);
      assertIsApEntity(item2);

      expect(item1.id?.toString()).toBe(example1Id);
      expect(item2.id?.toString()).toBe(example2Id);
    });
  });
});