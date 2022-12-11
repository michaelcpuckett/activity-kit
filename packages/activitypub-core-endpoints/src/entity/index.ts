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

    const entity = await this.adapters.db.findEntityById(this.url);

    if (!entity) {
      return this.handleNotFound();
    }

    if ('publicKey' in entity && entity.publicKey) {
      entity.publicKey = entity.publicKey;
    }

    this.res.setHeader('Vary', 'Accept');
    this.res.statusCode = 200;

    if (
      this.req.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE)
    ) {
      // TODO sign HTTP signature

      this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);

      if (!isTypeOf(entity, AP.CollectionTypes)) {
        this.res.write(stringify(entity));
        this.res.end();
        return;
      }

      if (isType(entity, AP.CollectionTypes.COLLECTION)) {
        const expandedItems = await Promise.all(entity.items.map(async (id: URL) => {
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

        this.res.write(stringify({
          ...entity,
          items,
        }));
        this.res.end();
        return;
      }

      if (isType(entity, AP.CollectionTypes.ORDERED_COLLECTION)) {
        const expandedItems = await Promise.all(entity.orderedItems.map(async (id: URL) => {
          return await this.adapters.db.queryById(id) ?? id;
        }));

        const orderedItems = [];

        for (const item of expandedItems) {
          if (item) {
            if (item instanceof URL) {
              orderedItems.push(item);
            } else {
              if (isTypeOf(item, AP.ActivityTypes) && 'object' in item && item.object instanceof URL) {
                const object = await this.adapters.db.findEntityById(item.object);

                if (object) {
                  item.object = object;
                }
              }

              orderedItems.push(item);
            }
          }
        }

        this.res.write(stringify({
          ...entity,
          orderedItems,
        }));
        this.res.end();
        return;
      }

      this.handleNotFound();
      return;
    } else {
      this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);

      let props = {
        entity,
        actor: authorizedActor,
      };

      if (this.plugins) {
        for (const plugin of this.plugins) {
          if ('getHomePageProps' in plugin && plugin.getHomePageProps) {
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
      this.res.end();
    }
  }
}
