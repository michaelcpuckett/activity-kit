import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
} from 'activitypub-core-utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { DbAdapter, AuthAdapter, Plugin, AP } from 'activitypub-core-types';

export class UserPostEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    auth: AuthAdapter;
    db: DbAdapter;
  };
  plugins?: Plugin[];

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
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

    const { email, type, password, name, preferredUsername } = body;

    if (!email) {
      this.res.statusCode = 300;
      this.res.write(
        JSON.stringify({
          error: 'Email is required.',
        }),
      );
      this.res.end();
      return;
    }

    if (!password) {
      this.res.statusCode = 300;
      this.res.write(
        JSON.stringify({
          error: 'Password is required.',
        }),
      );
      this.res.end();
      return;
    }

    if (!preferredUsername) {
      this.res.statusCode = 300;
      this.res.write(
        JSON.stringify({
          error: 'Username is required.',
        }),
      );
      this.res.end();
      return;
    }

    const isUsernameTaken = !!(await this.adapters.db.findOne('entity', {
      preferredUsername,
    }));

    if (isUsernameTaken || RESERVED_USERNAMES.includes(preferredUsername)) {
      this.res.statusCode = 409;
      this.res.write(
        JSON.stringify({
          error: 'Username taken.',
        }),
      );
      this.res.end();
      return;
    }

    const user = await this.adapters.auth.createUser({
      email,
      password,
      preferredUsername,
    });

    const isBotCreated = !!(await this.adapters.db.findOne('entity', {
      preferredUsername: SERVER_ACTOR_USERNAME,
    }));

    if (!isBotCreated) {
      await this.createServerActor();
    }

    await this.createUserActor({
      uid: user.uid,
      type,
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
