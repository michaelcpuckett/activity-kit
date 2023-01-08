import { HomeGetEndpoint } from '.';
import { AP, assertExists, assertIsApActor, assertIsApCollection, assertIsApType, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  convertUrlsToStrings,
  getId,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import cookie from 'cookie';
import { stringify } from 'activitypub-core-utilities';

export const respond = async function (this: HomeGetEndpoint, render: Function) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const actor = await this.adapters.db.getActorByUserId(
    await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''),
  );

  if (!actor) {
    this.res.statusCode = 302;
    this.res.setHeader('Location', '/login');
    this.res.end();
    return;
  }

  assertIsApActor(actor);

  const actorInbox = await this.adapters.db.findEntityById(getId(actor.inbox));
  const actorOutbox = await this.adapters.db.findEntityById(getId(actor.outbox));

  assertIsApType<AP.OrderedCollection>(actorInbox, AP.CollectionTypes.ORDERED_COLLECTION);
  assertIsApType<AP.OrderedCollection>(actorOutbox, AP.CollectionTypes.ORDERED_COLLECTION);

  actor.inbox = actorInbox;
  actor.outbox = actorOutbox;

  this.res.statusCode = 200;
  this.res.setHeader('Vary', 'Accept');

  if (
    this.req.headers.accept?.includes(ACTIVITYSTREAMS_CONTENT_TYPE) ||
    this.req.headers.accept?.includes(LINKED_DATA_CONTENT_TYPE) ||
    this.req.headers.accept?.includes(JSON_CONTENT_TYPE)
  ) {
    this.res.setHeader(CONTENT_TYPE_HEADER, ACTIVITYSTREAMS_CONTENT_TYPE);
    this.res.write(stringify(actor));
  } else {
    this.res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);

    let props = {
      actor,
    };

    if (this.plugins) {
      for (const plugin of this.plugins) {
        if ('getHomePageProps' in plugin && plugin.getHomePageProps) {
          props = {
            ...props,
            ...(await plugin.getHomePageProps(actor, this.req.url)),
          };
        }
      }
    }

    const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
      return [key, convertUrlsToStrings(value)];
    }));

    this.res.write(
      await render(formattedProps),
    );
  }
}