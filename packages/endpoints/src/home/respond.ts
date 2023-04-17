import { HomeGetEndpoint } from '.';
import { AP, assertIsApActor, assertIsApType } from '@activity-kit/types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  convertUrlsToStrings,
  getId,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
} from '@activity-kit/utilities';
import cookie from 'cookie';
import { stringify } from '@activity-kit/utilities';

export const respond = async function (
  this: HomeGetEndpoint,
  render: (...args: unknown[]) => Promise<string>,
) {
  const cookies = cookie.parse(this.req.headers.cookie ?? '');

  const actor = await this.core.getActorByUserId(
    await this.core.getUserIdByToken(cookies.__session ?? ''),
  );

  if (!actor) {
    this.res.statusCode = 302;
    this.res.setHeader('Location', '/login');
    this.res.end();
    return;
  }

  assertIsApActor(actor);

  const actorInbox = await this.core.findEntityById(getId(actor.inbox));
  const actorOutbox = await this.core.findEntityById(getId(actor.outbox));

  assertIsApType<AP.OrderedCollection>(
    actorInbox,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );

  assertIsApType<AP.OrderedCollection>(
    actorOutbox,
    AP.CollectionTypes.ORDERED_COLLECTION,
  );

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
            ...(await plugin.getHomePageProps.call(this, actor, this.req.url)),
          };
        }
      }
    }

    const formattedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => {
        return [key, convertUrlsToStrings(value)];
      }),
    );

    this.res.write(await render(formattedProps));
    this.res.end();
  }
};