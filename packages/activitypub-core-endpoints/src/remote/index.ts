import type { IncomingMessage, ServerResponse } from 'http';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';
import * as queryString from 'query-string';
import type { Database, Auth } from 'activitypub-core-types';
import { entityGetHandler } from '../entity';

export async function remoteHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
) {
  if (!req || !req.url) {
    throw new Error('Bad request');
  }

  const query = {
    ...queryString.parse(new URL(req.url, LOCAL_DOMAIN).search),
  } as { [key: string]: string };
  const resource = query.resource ?? '';

  if (resource) {
    return entityGetHandler(
      req,
      res,
      authenticationService,
      databaseService,
      new URL(query.resource),
    );
  }

  res.statusCode = 404;
  res.end();
}
