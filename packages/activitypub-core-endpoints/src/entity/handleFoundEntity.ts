import { EntityGetEndpoint } from '.';
import { AP, Plugin } from 'activitypub-core-types';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LINKED_DATA_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import { stringify } from 'activitypub-core-utilities';

export async function handleFoundEntity(
  this: EntityGetEndpoint,
  render: (...args: unknown[]) => Promise<string>,
  entity: AP.Entity,
  authorizedActor?: AP.Actor,
) {
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
            ...(await plugin.getEntityPageProps.call(this, entity)),
          };
        }
      }
    }

    const formattedProps = Object.fromEntries(
      Object.entries(props).map(([key, value]) => {
        if (typeof value === 'object') {
          return [key, convertUrlsToStrings(value)];
        } else {
          return [key, value];
        }
      }),
    );

    this.res.write(await render(formattedProps));
  }

  this.res.end();
}
