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
    this.res.statusCode = 400;
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

    // TODO authorize entity posts by actor.

    const entity = await this.adapters.db.findEntityById(new URL(`${LOCAL_DOMAIN}${this.url.pathname}`));

    if (!entity) {
      return this.handleNotFound();
    }

    if ('publicKey' in entity && entity.publicKey) {
      entity.publicKey = entity.publicKey;
    }

    this.res.setHeader('Vary', 'Accept');
    this.res.statusCode = 200;

    if (!isTypeOf(entity, AP.CollectionTypes) && !isTypeOf(entity, AP.CollectionPageTypes)) {
      this.handleFoundEntity(render, entity, authorizedActor);
      return;
    }

    // Otherwise, handle the collection.

    const isOrderedCollection = isType(entity, AP.CollectionTypes.ORDERED_COLLECTION);
    const lagePageIndex = Math.max(1, Math.ceil(Number(entity.totalItems) / ITEMS_PER_COLLECTION_PAGE));
    const query = this.url.searchParams;
    const page = query.get('page');
    const current = query.has('current');

    if (!page) {
      const collectionEntity = {
        ...entity,
        first: `${LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}`,
        last: `${LOCAL_DOMAIN}${this.url.pathname}?page=${lagePageIndex}${current ? '&current' : ''}`,
        current: `${LOCAL_DOMAIN}${this.url.pathname}?current`,
      };
      
      if (isOrderedCollection) {
        delete collectionEntity.orderedItems;
      } else {
        delete collectionEntity.items;
      }

      this.handleFoundEntity(render, collectionEntity, authorizedActor);

      return;
    }

    // Treated as a CollectionPage.

    const currentPage = Number(page);
    const firstItemIndex = (currentPage - 1) * ITEMS_PER_COLLECTION_PAGE + 1;

    if (!currentPage) {
      throw new Error('Bad query string value: not a number.');
    }

    const expandedItems = await Promise.all(entity[isOrderedCollection ? 'orderedItems' : 'items'].slice(firstItemIndex, firstItemIndex + ITEMS_PER_COLLECTION_PAGE)[current ? 'reverse' : 'slice']().map(async (id: URL) => {
      return await this.adapters.db.queryById(id);
    }));

    const items = [];

    for (const item of expandedItems) {
      if (item) {
        if (item instanceof URL) {
          items.push(item);
        } else {
          if (isTypeOf(item, AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
            const object = await this.adapters.db.findEntityById(item.object);

            if (object) {
              item.object = object;
            }
          }

          items.push(item);
        }
      }
    }

    const collectionPageEntity = {
      ...entity,
      type: isOrderedCollection ? AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE : AP.CollectionPageTypes.COLLECTION_PAGE,
      [isOrderedCollection ? 'orderedItems' : 'items']: items,
      ...isOrderedCollection ? {
        startIndex: firstItemIndex,
      } : null,
      partOf: `${LOCAL_DOMAIN}${this.url.pathname}${current ? '&current' : ''}`,
      ...(currentPage > 1) ? {
        prev: `${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage - 1}${current ? '&current' : ''}`
      } : null,
      ...(currentPage < lagePageIndex) ? {
        next: `${LOCAL_DOMAIN}${this.url.pathname}?page=${currentPage + 1}${current ? '&current' : ''}`
      } : null,
      first: `${LOCAL_DOMAIN}${this.url.pathname}?page=1${current ? '&current' : ''}`,
      last: `${LOCAL_DOMAIN}${this.url.pathname}?page=${lagePageIndex}${current ? '&current' : ''}`,
      current: `${LOCAL_DOMAIN}${this.url.pathname}?current`,
    };

    this.handleFoundEntity(render, collectionPageEntity, authorizedActor);
  }
}
