import { AppOptions, ServiceAccount } from 'firebase-admin';
import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
} from 'activitypub-core-utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import { AP, Plugin } from 'activitypub-core-types';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';

export async function userPostHandler(
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  plugins?: Plugin[]
) {
  const body: { [key: string]: string } = await new Promise(
    (resolve, reject) => {
      let data = '';

      req.on('data', function (chunk) {
        data += chunk;
      });

      req.on('end', function () {
        resolve(JSON.parse(data));
      });

      req.on('error', function () {
        reject('Failed to make an OAuth request');
      });
    },
  );

  const { email, password, name, preferredUsername } = body;

  const isUsernameTaken = !!(await databaseService.findOne('actor', {
    preferredUsername,
  }));

  if (isUsernameTaken || RESERVED_USERNAMES.includes(preferredUsername)) {
    res.statusCode = 409;
    res.write(
      JSON.stringify({
        error: 'Username Taken.',
      }),
    );
    res.end();
    return;
  }

  const user = await authenticationService.createUser({
    email,
    password,
    preferredUsername,
  });

  const isBotCreated = !!(await databaseService.findOne('actor', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  }));

  if (!isBotCreated) {
    await createServerActor(databaseService);
  }

  await createUserActor(databaseService, {
    uid: user.uid,
    email,
    preferredUsername,
    name,
  }, plugins);

  res.statusCode = 200;
  res.write(
    JSON.stringify({
      success: true,
    }),
  );
  res.end();
  return;
}
