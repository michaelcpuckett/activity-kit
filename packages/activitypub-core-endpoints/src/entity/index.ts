import { AP, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  isType,
  isTypeOf,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import { stringify } from 'activitypub-core-utilities';
import cookie from 'cookie';
import type { DbAdapter, AuthAdapter } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';

const ITEMS_PER_COLLECTION_PAGE = 50;

export class EntityGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];
  url: URL;

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
    },
    plugins?: Plugin[],
    url?: URL,
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
    this.url = url ?? new URL(`${LOCAL_DOMAIN}${req.url}`);
  }

  protected handleBadRequest() {
    this.res.statusCode = 500;
    this.res.write('Bad request');
    this.res.end();

    return {
      props: {},
    };
  }

  protected async handleFoundEntity(render: Function, entity: AP.Entity, authorizedActor?: AP.Actor) {
    if (
      this.req.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE)
    ) {
      this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
      this.res.write(stringify(entity));
    } else {
      this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);

      let props = {
        entity,
        actor: authorizedActor,
      };

      if (this.plugins) {
        for (const plugin of this.plugins) {
          if ('getEntityPageProps' in plugin && plugin.getEntityPageProps) {
            props = {
              ...props,
              ...(await plugin.getEntityPageProps(entity)),
            };
          }
        }
      }

      const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
        if (typeof value === 'object') {
          return [key, convertUrlsToStrings(value)];
        } else {
          return [key, value];
        }
      }));

      this.res.write(
        await render(formattedProps),
      );
    }

    this.res.end();
  }

  protected handleNotFound() {
    this.res.statusCode = 404;
    this.res.write('Not found');
    this.res.end();

    return {
      props: {},
    };
  }

  public async respond(render: Function) {
    const cookies = cookie.parse(this.req.headers.cookie ?? '');

    const authorizedActor = await this.adapters.db.getActorByUserId(
      await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
    );
    const query = this.url.searchParams;
    const page = query.get('page');
    const current = query.has('current');
    const typeFilter = query.has('type') ? query.get('type').split(',') : [];

    // TODO authorize entity posts by actor.

    const entity = (await this.adapters.db.findAll('entity', {
      id: `${LOCAL_DOMAIN}${this.url.pathname}`,
      ...typeFilter.length ? {
        orderedItems: {
          type: { $in: typeFilter },
        },
      } : null,
    }))?.[0];

    if (!entity) {
      return this.handleNotFound();
    }

    if ('publicKey' in entity && entity.publicKey) {
      entity.publicKey = entity.publicKey;
    }

    this.res.setHeader('Vary', 'Accept');
    this.res.statusCode = 200;

    if (!isTypeOf(entity, AP.CollectionTypes) && !isTypeOf(entity, AP.CollectionPageTypes)) {
      return this.handleFoundEntity(render, entity, authorizedActor);
    }

    // Otherwise, handle the collection.

    const isOrderedCollection = isType(entity, AP.CollectionTypes.ORDERED_COLLECTION);
    const items = entity[isOrderedCollection ? 'orderedItems' : 'items'];
    const limit = query.has('limit') ? Number(query.get('limit')) : ITEMS_PER_COLLECTION_PAGE;
    const lastPageIndex = Math.max(1, Math.ceil(items.length / limit));
    const currentPage = Number(page);
    const firstItemIndex = (currentPage - 1) * limit;
    const startIndex = firstItemIndex + 1;

    // If no page, treat as a Collection.
    if (!page) {
      const collectionEntity = {
        ...entity,
        first: `${LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`,
        last: `${LOCAL_DOMAIN}${this.url.pathname}?page=${lastPageIndex}${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`,
        current: `${LOCAL_DOMAIN}${this.url.pathname}?current`,
        totalItems: items.length,
      };

      return this.handleFoundEntity(render, collectionEntity, authorizedActor);
    }

    // Treated as a CollectionPage.

    if (!currentPage) {
      throw new Error('Bad query string value: not a number.');
    }

    const expandedItems = await Promise.all(items[current ? 'slice' : 'reverse']().slice(firstItemIndex, firstItemIndex + limit).map(async (id: URL) => {
      return await this.adapters.db.queryById(id);
    }));

    const fullyExpandedItems = [];

    for (const item of expandedItems) {
      if (item) {
        if (item instanceof URL) {
          fullyExpandedItems.push(item);
        } else {
          if (isTypeOf(item, AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
            const object = await this.adapters.db.findEntityById(item.object);

            if (object) {
              item.object = object;
            }
          }

          fullyExpandedItems.push(item);
        }
      }
    }

    const collectionPageEntity = {
      ...entity,
      id: new URL(`${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage}${current ? '&current' : ''}`),
      url: new URL(`${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage}${current ? '&current' : ''}`),
      type: isOrderedCollection ? AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE : AP.CollectionPageTypes.COLLECTION_PAGE,
      [isOrderedCollection ? 'orderedItems' : 'items']: fullyExpandedItems,
      ...isOrderedCollection ? {
        startIndex,
      } : null,
      partOf: `${LOCAL_DOMAIN}${this.url.pathname}${current ? '?current' : ''}`,
      ...(currentPage > 1) ? {
        prev: `${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage - 1}${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`
      } : null,
      ...(currentPage < lastPageIndex) ? {
        next: `${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage + 1}${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`
      } : null,
      first: `${LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`,
      last: `${LOCAL_DOMAIN}${this.url.pathname}?page=${lastPageIndex}${current ? '&current' : ''}${typeFilter.length ? `&type=${typeFilter.join(',')}` : ''}${query.has('limit') ? `&limit=${limit}` : ''}`,
      current: `${LOCAL_DOMAIN}${this.url.pathname}?current`,
      totalItems: items.length,
    };

    return this.handleFoundEntity(render, collectionPageEntity, authorizedActor);
  }
}
