import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

import { Result } from '../types';
import { EntityGetEndpoint } from '.';

// TODO: Move to config.
const ITEMS_PER_COLLECTION_PAGE = 50;

export async function handleFoundCollectionPage(
  this: EntityGetEndpoint,
  entity: AP.EitherCollectionPage,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<Result> {
  const pageParts = this.url.href.split('/page/');
  const getPageUrl = (page: number) =>
    new URL(
      `${this.url.pathname === '/' ? '' : this.url.pathname}/page/${page}`,
      this.url.origin,
    );
  const page = pageParts[1];
  const currentPage = page ? Number(page) : 1;
  const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE;
  const startIndex = firstItemIndex + 1;

  const limitedItems = getCollectionItems(entity).slice(
    firstItemIndex,
    firstItemIndex + ITEMS_PER_COLLECTION_PAGE,
  );

  const items = expandItems(limitedItems);

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

function expandItems(
  objects: Array<unknown>,
): Array<AP.Object | AP.Link | AP.Mention> {
  return objects.map((object) => {
    if (guard.isApLink(object)) {
      return object;
    }

    if (guard.isApMention(object)) {
      return object;
    }

    if (guard.isApObject(object)) {
      return {
        ...object,
        id: getId(object),
        url: new URL(getId(object)),
      };
    }

    return object;
  });
}

function getCollectionItems(collection: AP.EitherCollection) {
  if (guard.isArray(collection.orderedItems)) {
    return collection.orderedItems;
  }

  if (guard.isArray(collection.items)) {
    return collection.items;
  }

  return [];
}

function foo() {
  const items: AP.Entity[] = [];

  for (const item of limitedItems) {
    if (guard.isApTransitiveActivity(item)) {
      const objectId = getId(item.object);

      if (objectId) {
        const object = await this.core.findEntityById(objectId);

        if (object) {
          item.object = object;
        }
      }
    }

    if (guard.isApEntity(item)) {
      items.push(item);
    }
  }

  return items;
}
