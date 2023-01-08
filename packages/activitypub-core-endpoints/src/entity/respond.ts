import { EntityGetEndpoint } from '.';
import { AP, assertIsApCollection, assertIsApEntity, assertIsApType, assertIsArray, assertIsDate, assertIsNumber, assertIsString } from 'activitypub-core-types';
import { getId, isType, isTypeOf, LOCAL_DOMAIN } from 'activitypub-core-utilities';
import cookie from 'cookie';

const ITEMS_PER_COLLECTION_PAGE = 50;

export async function respond(this: EntityGetEndpoint, render: Function) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const authorizedActor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  // TODO authorize entity posts by actor.

  const entity = await this.adapters.db.findEntityById(new URL(`${LOCAL_DOMAIN}${this.url.pathname}`));

  try {
    assertIsApEntity(entity);
  } catch (error) {
    return this.handleNotFound();
  }

  this.res.setHeader('Vary', 'Accept');

  if (!isTypeOf(entity, AP.CollectionTypes) && !isTypeOf(entity, AP.CollectionPageTypes)) {
    return await this.handleFoundEntity(render, entity, authorizedActor);
  }

  const isOrderedCollection = isType(entity, AP.CollectionTypes.ORDERED_COLLECTION);
  const query = this.url.searchParams;
  const page = query.get('page');
  const current = query.has('current');
  const sort = query.get('sort');
  const limit = query.has('limit') ? Number(query.get('limit')) : ITEMS_PER_COLLECTION_PAGE;
  const entityItems = isOrderedCollection ? (entity as AP.OrderedCollection).orderedItems : (entity as AP.Collection).items;
  
  assertIsArray(entityItems);
  
  const lastPageIndex = Math.max(1, Math.ceil(entityItems.length / limit));
  const currentPage = Number(page) || 1;
  const firstItemIndex = (currentPage - 1) * limit;
  const startIndex = firstItemIndex + 1;

  if (!page) {
    // Treat as a Collection.
    try {
      assertIsApType<AP.OrderedCollection>(entity, AP.CollectionTypes.ORDERED_COLLECTION);
      delete entity.orderedItems;
    } catch (error) {
      assertIsApType<AP.Collection>(entity, AP.CollectionTypes.COLLECTION);
      delete entity.items;
    }

    const collectionEntity = {
      ...entity,
      first: new URL(`${LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}${sort ? `&sort=${sort}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`),
      last: new URL(`${LOCAL_DOMAIN}${this.url.pathname}?page=${lastPageIndex}${current ? '&current' : ''}${sort ? `&sort=${sort}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`),
      current: new URL(`${LOCAL_DOMAIN}${this.url.pathname}?current`),
      totalItems: entityItems.length,
    };

    return await this.handleFoundEntity(render, collectionEntity, authorizedActor);
  }

  // Treat as CollectionPage.

  const expandedItems = await Promise.all(entityItems.map(async (entity: AP.EntityReference) => {
    const id = getId(entity);
    return await this.adapters.db.findEntityById(id);
  }));

  const sortedItems = sort ? expandedItems.sort((a: AP.Entity|null, b: AP.Entity|null) => {
    const aField = a && sort in a && (a as unknown as {[key: string]: unknown})[sort];
    const bField = b && sort in b && (b as unknown as {[key: string]: unknown})[sort];

    try {
      assertIsString(aField);
      assertIsString(bField);

      if (aField.toLowerCase() > bField.toLowerCase()) {
        return current ? -1 : 1;
      } else {
        return current ? 1 : -1;
      }
    } catch (error) {
      try {
        assertIsDate(aField);
        assertIsDate(bField);

        if (aField.valueOf() > bField.valueOf()) {
          return current ? -1 : 1;
        } else {
          return current ? 1 : -1;
        }
      } catch (error) {
        try {
          assertIsNumber(aField);
          assertIsNumber(bField);

          if (aField > bField) {
            return current ? -1 : 1;
          } else {
            return current ? 1 : -1;
          }
        } catch (error) {
          return current ? 1 : -1;
        }
      }
    }
  }) : expandedItems;

  const limitedItems = sortedItems.slice(firstItemIndex, firstItemIndex + limit);

  const items: AP.Entity[] = [];

  for (const item of limitedItems) {
    if (item) {
      if (isTypeOf(item, AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
        const object = await this.adapters.db.findEntityById(item.object);

        if (object) {
          item.object = object;
        }
      }

      items.push(item);
    }
  }

  const baseUrl = `${LOCAL_DOMAIN}${this.url.pathname}`;
  const urlEnding = `${current ? '&current' : ''}${query.has('limit') ? `&limit=${limit}` : ''}${sort ? `&sort=${sort}` : ''}`;

  const collectionPageEntity = {
    ...entity,
    type: isOrderedCollection ? AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE : AP.CollectionPageTypes.COLLECTION_PAGE,
    id: new URL(`${baseUrl}?page=${currentPage}${urlEnding}`),
    url: new URL(`${baseUrl}?page=${currentPage}${urlEnding}`),
    partOf: new URL(`${baseUrl}${current ? '?current' : ''}`),
    first: new URL(`${baseUrl}?page=1${urlEnding}`),
    last: new URL(`${baseUrl}?page=${lastPageIndex}${urlEnding}`),
    current: new URL(`${baseUrl}?current`),
    ...(currentPage > 1) ? {
      prev: new URL(`${baseUrl}?page=${currentPage - 1}${urlEnding}`),
    } : null,
    ...(currentPage < lastPageIndex) ? {
      next: new URL(`${baseUrl}?page=${currentPage + 1}${urlEnding}`),
    } : null,
    [isOrderedCollection ? 'orderedItems' : 'items']: items,
    ...isOrderedCollection ? {
      startIndex,
    } : null,
    totalItems: entityItems.length,
  };

  return await this.handleFoundEntity(render, collectionPageEntity, authorizedActor);
}