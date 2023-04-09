import { EntityGetEndpoint } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
  assertIsDate,
  assertIsNumber,
  assertIsString,
} from 'activitypub-core-types';
import {
  isType,
  isTypeOf,
  LOCAL_DOMAIN,
  LOCAL_HOSTNAME,
} from 'activitypub-core-utilities';
import cookie from 'cookie';

const ITEMS_PER_COLLECTION_PAGE = 50;

export async function respond(this: EntityGetEndpoint, render: Function) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const authorizedActor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  // TODO authorize entity posts by actor.

  const entity = await this.adapters.db.findEntityById(
    new URL(`${LOCAL_DOMAIN}${this.url.pathname}`),
  );

  try {
    assertIsApEntity(entity);
  } catch (error) {
    return this.handleNotFound();
  }

  this.res.setHeader('Vary', 'Accept');

  if (
    !isTypeOf(entity, AP.CollectionTypes) &&
    !isTypeOf(entity, AP.CollectionPageTypes)
  ) {
    return await this.handleFoundEntity(render, entity, authorizedActor);
  }

  assertIsApCollection(entity);

  const isOrderedCollection = isType(
    entity,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );
  const urlParts = this.url.pathname.split('/');
  const pageParam = urlParts.pop();
  const hasPage = String(Number(pageParam)) === pageParam;
  const pathname = hasPage ? urlParts.join('/') : this.url.pathname;

  const query = this.url.searchParams;
  const limit = query.has('limit')
    ? Number(query.get('limit'))
    : ITEMS_PER_COLLECTION_PAGE;
  const hasLimit = limit !== ITEMS_PER_COLLECTION_PAGE;
  const totalItems = Number(entity.totalItems);
  const lastPageIndex = Math.max(1, Math.ceil(totalItems / limit));
  const currentPage = Number(pageParam) || 1;
  const firstItemIndex = (currentPage - 1) * limit;
  const startIndex = firstItemIndex + 1;
  const sort = query.get('sort');
  const searchParams = new URLSearchParams({
    ...(sort
      ? {
          sort,
        }
      : null),
    ...(hasLimit
      ? {
          limit: `${limit}`,
        }
      : null),
  });
  const baseUrl = new URL(pathname, new URL(LOCAL_HOSTNAME));
  baseUrl.search = searchParams.toString();

  const getPageUrl = (page: number) => {
    const url = new URL(`${pathname}/${page}`, new URL(LOCAL_HOSTNAME));
    url.search = searchParams.toString();
    return url;
  };

  // Treat as a Collection.

  if (!hasPage) {
    assertIsApCollection(entity);

    if (isType(entity, AP.CollectionTypes.ORDERED_COLLECTION)) {
      assertIsApType<AP.OrderedCollection>(
        entity,
        AP.CollectionTypes.ORDERED_COLLECTION,
      );

      delete entity.orderedItems;
    }

    if (isType(entity, AP.CollectionTypes.COLLECTION)) {
      assertIsApType<AP.Collection>(entity, AP.CollectionTypes.COLLECTION);

      delete entity.items;
    }

    const collectionEntity = {
      ...entity,
      first: getPageUrl(1),
      last: getPageUrl(lastPageIndex),
    };

    return await this.handleFoundEntity(
      render,
      collectionEntity,
      authorizedActor,
    );
  }

  // Treat as CollectionPage.

  const expandedCollection = await this.adapters.db.expandCollection(entity);

  const expandedItems = (() => {
    if (isType(expandedCollection, AP.CollectionTypes.ORDERED_COLLECTION)) {
      assertIsApType<AP.OrderedCollection>(
        expandedCollection,
        AP.CollectionTypes.ORDERED_COLLECTION,
      );
      return expandedCollection.orderedItems;
    }

    if (isType(expandedCollection, AP.CollectionTypes.COLLECTION)) {
      assertIsApType<AP.Collection>(
        expandedCollection,
        AP.CollectionTypes.COLLECTION,
      );
      return expandedCollection.items;
    }
  })();

  assertIsArray(expandedItems);

  const sortedItems = sort
    ? expandedItems.sort((a: AP.Entity | null, b: AP.Entity | null) => {
        const aField =
          a && sort in a && (a as unknown as { [key: string]: unknown })[sort];
        const bField =
          b && sort in b && (b as unknown as { [key: string]: unknown })[sort];

        try {
          assertIsString(aField);
          assertIsString(bField);

          if (aField.toLowerCase() > bField.toLowerCase()) {
            return 1;
          } else {
            return -1;
          }
        } catch (error) {
          try {
            assertIsDate(aField);
            assertIsDate(bField);

            if (aField.valueOf() > bField.valueOf()) {
              return 1;
            } else {
              return -1;
            }
          } catch (error) {
            try {
              assertIsNumber(aField);
              assertIsNumber(bField);

              if (aField > bField) {
                return 1;
              } else {
                return -1;
              }
            } catch (error) {
              return 0;
            }
          }
        }
      })
    : expandedItems;

  const limitedItems = sortedItems.slice(
    firstItemIndex,
    firstItemIndex + limit,
  );

  const items: AP.Entity[] = [];

  for (const item of limitedItems) {
    if (item && !(item instanceof URL)) {
      if (
        isTypeOf(item, AP.ActivityTypes) &&
        'object' in item &&
        item.object instanceof URL
      ) {
        const object = await this.adapters.db.findEntityById(item.object);

        if (object) {
          item.object = object;
        }
      }

      items.push(item);
    }
  }

  const collectionPage = {
    ...entity,
    id: getPageUrl(currentPage),
    url: getPageUrl(currentPage),
    partOf: baseUrl,
    first: getPageUrl(1),
    last: getPageUrl(lastPageIndex),
    ...(currentPage > 1
      ? {
          prev: getPageUrl(currentPage - 1),
        }
      : null),
    ...(currentPage < lastPageIndex
      ? {
          next: getPageUrl(currentPage + 1),
        }
      : null),
  };

  if (isOrderedCollection) {
    const orderedCollectionPageEntity: AP.OrderedCollectionPage = {
      ...collectionPage,
      type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
      orderedItems: items,
      startIndex,
    };

    return await this.handleFoundEntity(
      render,
      orderedCollectionPageEntity,
      authorizedActor,
    );
  }

  const collectionPageEntity: AP.CollectionPage = {
    ...collectionPage,
    type: AP.CollectionPageTypes.COLLECTION_PAGE,
    items: items,
  };

  return await this.handleFoundEntity(
    render,
    collectionPageEntity,
    authorizedActor,
  );
}

function assertIsApCollectionOrCollectionPage(
  value: unknown,
): asserts value is
  | AP.Collection
  | AP.OrderedCollection
  | AP.CollectionPage
  | AP.OrderedCollectionPage {
  assertIsApEntity(value);

  if (
    !isTypeOf(value, AP.CollectionTypes) &&
    !isTypeOf(value, AP.CollectionPageTypes)
  ) {
    throw new Error(`\`${value}\` is not a Collection or CollectionPage.`);
  }
}
