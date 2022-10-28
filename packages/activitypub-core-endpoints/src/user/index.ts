import { AppOptions, ServiceAccount } from 'firebase-admin';
import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
} from 'activitypub-core-utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import type { Database, Auth, Plugin } from 'activitypub-core-types';

export class UserPostEndpoint {
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

  protected createServerActor = createServerActor;
  protected createUserActor = createUserActor;

  public async respond() {
    const body: { [key: string]: string } = await new Promise(
      (resolve, reject) => {
        let data = '';

        this.req.on('data', function (chunk) {
          data += chunk;
        });

        this.req.on('end', function () {
          resolve(JSON.parse(data));
        });

        this.req.on('error', function () {
          reject('Failed to make an OAuth request');
        });
      },
    );

    const { email, password, name, preferredUsername } = body;

    const isUsernameTaken = !!(await this.adapters.database.findOne('actor', {
      preferredUsername,
    }));

    if (isUsernameTaken || RESERVED_USERNAMES.includes(preferredUsername)) {
      this.res.statusCode = 409;
      this.res.write(
        JSON.stringify({
          error: 'Username Taken.',
        }),
      );
      this.res.end();
      return;
    }

    const user = await this.adapters.authentication.createUser({
      email,
      password,
      preferredUsername,
    });

    const isBotCreated = !!(await this.adapters.database.findOne('actor', {
      preferredUsername: SERVER_ACTOR_USERNAME,
    }));

    if (!isBotCreated) {
      await this.createServerActor();
    }

    await this.createUserActor({
      uid: user.uid,
      email,
      preferredUsername,
      name,
    });

    this.res.statusCode = 200;
    this.res.write(
      JSON.stringify({
        success: true,
      }),
    );
    this.res.end();
  }
}
