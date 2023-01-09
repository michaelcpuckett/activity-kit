import { AP, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import { stringify } from 'activitypub-core-utilities';
import { respond } from './respond';
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

  protected async handleFoundEntity(render: Function, entity: AP.Entity, authorizedActor?: AP.Actor) {
    this.res.statusCode = 200;
    
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

  public respond = respond;
}
