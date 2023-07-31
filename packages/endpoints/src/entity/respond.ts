import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';
import { Result } from '../types';

import { EntityGetEndpoint } from '.';

// TODO: Move to config.
const ITEMS_PER_COLLECTION_PAGE = 50;

export async function respond(
  this: EntityGetEndpoint,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<Result> {
  const hasPage = this.url.href.includes('/page/');
  const pageParts = this.url.href.split('/page/');
  const baseUrl = hasPage ? new URL(pageParts[0]) : this.url;
  const entity = await this.core.findEntityById(baseUrl);

  if (!entity || !guard.isApEntity(entity)) {
    return await this.handleNotFound();
  }

  if (guard.isApCollection(entity)) {
    return handleCollection.bind(this)(entity, render);
  }

  return await this.handleFoundEntity(entity, render);
}

async function handleCollection(
  this: EntityGetEndpoint,
  entity: AP.EitherCollection,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<Result> {
  const hasPage = this.url.href.includes('/page/');
  const totalItems = entity.totalItems ?? 0;
  const lastPageIndex = Math.max(
    1,
    Math.ceil(totalItems / ITEMS_PER_COLLECTION_PAGE),
  );

  const collectionEntity = {
    ...entity,
    totalItems,
    first: getPageUrl.bind(this)(1),
    last: getPageUrl.bind(this)(lastPageIndex),
  };

  if (!hasPage) {
    delete collectionEntity.orderedItems;
    delete collectionEntity.items;

    return await this.handleFoundCollection(collectionEntity, render);
  }

  if (guard.isApType(entity, AP.CollectionTypes.ORDERED_COLLECTION)) {
    const orderedCollectionPageEntity: AP.OrderedCollectionPage = {
      ...collectionEntity,
      type: AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE,
    };

    return await this.handleFoundCollectionPage(
      orderedCollectionPageEntity,
      render,
    );
  }

  const collectionPageEntity: AP.CollectionPage = {
    ...collectionEntity,
    type: AP.CollectionPageTypes.COLLECTION_PAGE,
  };

  return await this.handleFoundCollectionPage(collectionPageEntity, render);
}

function getPageUrl(this: EntityGetEndpoint, page: number) {
  const pathname = this.url.pathname === '/' ? '' : this.url.pathname;
  const pageUrl = `${pathname}/page/${page}`;

  return new URL(pageUrl, this.url.origin);
}
