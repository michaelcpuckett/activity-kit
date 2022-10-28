import { IncomingMessage } from 'http';
import { AP, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACTIVITYSTREAMS_CONTENT_TYPE_WITH_PROFILE,
  CONTENT_TYPE_HEADER,
  convertUrlsToStrings,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import cookie from 'cookie';
import type { ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
import { stringify } from 'activitypub-core-utilities';

export class HomeGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    authentication: Auth;
    database: Database;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      authentication: Auth;
      database: Database;
    },
    plugins?: Plugin[],
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
    this.plugins = plugins;
  }

  public async respond(render: Function) {
    const cookies = cookie.parse(this.req.headers.cookie ?? '');

    const actor = await this.adapters.database.getActorByUserId(
      await this.adapters.authentication.getUserIdByToken(
        cookies.__session ?? '',
      ),
    );

    if (!actor) {
      // TODO!
      return {
        redirect: {
          permanent: false,
          destination: '/',
        },
      };
    }

    if (!actor.inbox || !actor.outbox) {
      throw new Error('Bad actor.');
    }

    actor.inbox = await this.adapters.database.findEntityById(actor.inbox);
    actor.outbox = await this.adapters.database.findEntityById(actor.outbox);

    let data: {
      props?: {
        actor?: AP.Actor;
      };
    } = {
      props: {
        actor,
      },
    };

    this.res.statusCode = 200;

    if (
      this.req.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE)
    ) {
      this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
      this.res.write(stringify(data.props.actor));
    } else {
      this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      this.res.write(
        await render({
          actor: convertUrlsToStrings(data.props.actor) as AP.Actor,
        }),
      );
    }

    this.res.end();
  }
}
