import { WebfingerGetEndpoint } from '.';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  JRD_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN,
  LOCAL_HOSTNAME,
  XRD_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import {assertExists, assertIsApActor, DbOptions} from 'activitypub-core-types';

export const respond = async function (this: WebfingerGetEndpoint) {
  try {
    this.res.setHeader('Vary', 'Accept');

    assertExists(this.req.url);

    const query = new URL(this.req.url, LOCAL_DOMAIN).searchParams;

    assertExists(query);

    const resource = query.get('resource');

    assertExists(resource);

    if (!resource.startsWith('acct:')) {
      throw new Error('Not found.');
    }

    const [account, hostname] = resource.split('@');
    const [, username] = account.split(':');

    if (hostname !== LOCAL_HOSTNAME) {
      throw new Error('Not found.');
    }

    const actor = await this.adapters.db.findOne('entity', {
      preferredUsername: username,
    }, [DbOptions.CASE_INSENSITIVE]);

    assertIsApActor(actor);

    const actorUrl = actor.url;

    assertExists(actorUrl);

    this.res.statusCode = 200;

    if (
      this.req.headers.accept?.includes(JSON_CONTENT_TYPE) ||
      this.req.headers.accept?.includes(JRD_CONTENT_TYPE)
    ) {
      const finger = {
        subject: `acct:${actor.preferredUsername}@${LOCAL_HOSTNAME}`,
        aliases: [
          actorUrl.toString(),
        ],
        links: [
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: HTML_CONTENT_TYPE,
            href: actorUrl.toString(),
          },
          {
            rel: 'self',
            type: ACTIVITYSTREAMS_CONTENT_TYPE,
            href: actorUrl.toString(),
          },
        ],
      };

      this.res.setHeader(CONTENT_TYPE_HEADER, JRD_CONTENT_TYPE);
      this.res.write(JSON.stringify(finger));
    } else {
      const finger = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Subject>acct:${actor.preferredUsername}@${LOCAL_HOSTNAME}</Subject>
          <Alias>${actorUrl.toString()}</Alias>
          <Link
            rel="http://webfinger.net/rel/profile-page"
            type="${HTML_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
          <Link
            rel="self"
            type="${ACTIVITYSTREAMS_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
        </XRD>
      `.trim();

      this.res.setHeader(CONTENT_TYPE_HEADER, XRD_CONTENT_TYPE);
      this.res.write(finger);
    }

    this.res.end();
  } catch (error) {
    this.res.statusCode = 404;
    this.res.end();
  }
}