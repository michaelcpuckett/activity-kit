import { EntityGetEndpoint } from '.';
import {
  AP,
  assertIsApCollection,
  assertIsApEntity,
  assertIsApType,
  assertIsArray,
} from 'activitypub-core-types';
import { isType, isTypeOf, LOCAL_DOMAIN } from 'activitypub-core-utilities';
import cookie from 'cookie';

const ITEMS_PER_COLLECTION_PAGE = 50;

export async function respond(this: EntityGetEndpoint, render: Function) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const authorizedActor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  // TODO authorize entity posts by actor.

  // Remove CollectionPage URL /page/:page param
  const urlParts = this.url.pathname.split('/');
  const pageParam = urlParts.pop();
  const hasPage = this.req.params['page'] === pageParam;
  if (hasPage) {
    urlParts.pop();
  }
  const pathname = hasPage ? urlParts.join('/') : this.url.pathname;

  const entity = await this.adapters.db.findEntityById(
    new URL(`${LOCAL_DOMAIN}${pathname}`),
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

  const totalItems = Number(entity.totalItems);
  const lastPageIndex = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE),
  );
  const currentPage = Number(pageParam) || 1;
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
  const startIndex = firstItemIndex + 1;
  const baseUrl = new URL(pathname, new URL(LOCAL_DOMAIN));

  const getPageUrl = (page: number) =>
    new URL(
      `${pathname === '/' ? '' : pathname}/page/${page}`,
      new URL(LOCAL_DOMAIN),
    );

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

  const limitedItems = expandedItems.slice(
    firstItemIndex,
    firstItemIndex + ITEMS_PER_COLLECTION_PAGE,
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
