import type { IncomingMessage, ServerResponse } from 'http';
import { ACTIVITYSTREAMS_CONTENT_TYPE, CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE, JSON_CONTENT_TYPE, LOCAL_DOMAIN, LOCAL_HOSTNAME } from 'activitypub-core-utilities';
import * as queryString from 'query-string';
import { Database } from 'activitypub-core-types';

export async function webfingerHandler (
  req: IncomingMessage,
  res: ServerResponse,
  databaseService: Database
) {
  if (!req || !req.url) {
    throw new Error('Bad request');
  }

  const query = {...queryString.parse(new URL(req.url, LOCAL_DOMAIN).search)} as { [key: string]: string };
  console.log(query);
  const resource = query.resource ?? '';
  const [account] = resource.split('@');
  const [, username] = account.split(':');

  if (username) {
    const actor = await databaseService.findOne('actor', {
      preferredUsername: username
    });

    if (actor) {
      const finger = {
        subject: `acct:${username}@${LOCAL_HOSTNAME}`,
        links: [
          {
            rel: 'http://webfinger.net/rel/profile-page',
            type: HTML_CONTENT_TYPE,
            href: actor.url.toString(),
          },
          {
            rel: 'self',
            type: ACTIVITYSTREAMS_CONTENT_TYPE,
            href: actor.url.toString(),
          },
        ],
      };

      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE)
      res.write(JSON.stringify(finger));
      res.end();
      return;
    }
  }

  
  res.statusCode = 404;
  res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
  res.end();
};
