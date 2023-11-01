import * as AP from '@activity-kit/types';
import { assert, guard } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

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

  const collection = await this.core.queryById(new URL(pageParts[0]));

  assert.isApCollection(collection);

  const collectionItems = getCollectionItems(collection);

  const lastPageIndex = Math.ceil(
    collectionItems.length / ITEMS_PER_COLLECTION_PAGE,
  );

  const limitedItems = collectionItems.slice(
    firstItemIndex,
    firstItemIndex + ITEMS_PER_COLLECTION_PAGE,
  );

  const items = expandItems(limitedItems);
  const collectionId = getId(collection);

  assert.exists(collectionId);

  const collectionPage = {
    ...entity,
    id: getPageUrl(currentPage),
    url: getPageUrl(currentPage),
    partOf: collectionId,
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

  if (
    guard.isApType<AP.OrderedCollection>(
      collection,
      AP.CollectionTypes.ORDERED_COLLECTION,
    )
  ) {
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
): Array<AP.CoreObject | AP.Link | AP.Mention> {
  return objects
    .map((object) => {
      if (guard.isApType<AP.Link>(object, AP.LinkTypes.LINK)) {
        return object;
      }

      if (guard.isApType<AP.Mention>(object, AP.LinkTypes.MENTION)) {
        return object;
      }

      if (guard.isApCoreObject(object)) {
        const id = getId(object);

        if (guard.exists(id)) {
          return {
            ...object,
            id,
            url: id,
          };
        }
      }

      return object;
    })
    .filter(guard.isApEntity);
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
