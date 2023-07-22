import * as AP from '@activity-kit/types';
import {
  assertIsApCollection,
  assertIsApEntity,
  assertIsArray,
  isType,
  isTypeOf,
} from '@activity-kit/type-utilities';

import { EntityGetEndpoint } from '.';

const ITEMS_PER_COLLECTION_PAGE = 50;

export async function respond(
  this: EntityGetEndpoint,
  render: (args: { entity: AP.Entity }) => Promise<string>,
): Promise<{
  statusCode: number;
  contentType?: string;
  body: string;
}> {
  const hasPage = this.url.href.includes('/page/');
  const pageParts = this.url.href.split('/page/');
  const baseUrl = hasPage ? new URL(pageParts[0]) : this.url;
  const entity = await this.core.findEntityById(baseUrl);

  try {
    assertIsApEntity(entity);
  } catch (error) {
    return this.handleNotFound();
  }

  if (
    !isTypeOf<AP.EitherCollection>(entity, AP.CollectionTypes) &&
    !isTypeOf<AP.EitherCollectionPage>(entity, AP.CollectionPageTypes)
  ) {
    return this.handleFoundEntity(entity, render);
  }

  assertIsApCollection(entity);

  const totalItems = Number(entity.totalItems);

  const lastPageIndex = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE),
  );

  const isOrderedCollection = isType<AP.OrderedCollection>(
    entity,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );

  const getPageUrl = (page: number) =>
    new URL(
      `${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`,
      this.url.origin,
    );

  // Treat as a Collection.

  const page = pageParts[1];
  const currentPage = page ? Number(page) : 1;
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
  const startIndex = firstItemIndex + 1;

  if (!hasPage) {
    assertIsApCollection(entity);

    delete entity.orderedItems;
    delete entity.items;

    const collectionEntity = {
      ...entity,
      first: getPageUrl(1),
      last: getPageUrl(lastPageIndex),
    };

    return this.handleFoundEntity(collectionEntity, render);
  }

  // Treat as CollectionPage.

  const expandedCollection = await this.core.expandCollection(entity);

  const expandedItems = (() => {
    if (
      Array.isArray(expandedCollection.type)
        ? expandedCollection.type.includes(
            AP.CollectionTypes.ORDERED_COLLECTION,
          )
        : expandedCollection.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      return expandedCollection.orderedItems;
    }

    if (
      Array.isArray(expandedCollection.type)
        ? expandedCollection.type.includes(AP.CollectionTypes.COLLECTION)
        : expandedCollection.type === AP.CollectionTypes.COLLECTION
    ) {
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
        isTypeOf<AP.Activity>(item, AP.ActivityTypes) &&
        'object' in item &&
        item.object instanceof URL
      ) {
        const object = await this.core.findEntityById(item.object);

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

    return this.handleFoundEntity(orderedCollectionPageEntity, render);
  }

  const collectionPageEntity: AP.CollectionPage = {
    ...collectionPage,
    type: AP.CollectionPageTypes.COLLECTION_PAGE,
    items: items,
  };

  return this.handleFoundEntity(collectionPageEntity, render);
}
