import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
  streamToString,
} from '@activity-kit/utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/types';

export class User {
  readonly uid: string;
  readonly type: string;
  readonly email: string;
  readonly name: string;
  readonly preferredUsername: string;
  readonly password: string;

  constructor(rawBody: Record<string, unknown>) {
    if (typeof rawBody.uid !== 'string') {
      throw {
        error: 'No uid provided',
        field: 'uid',
      };
    }

    if (typeof rawBody.type !== 'string') {
      throw {
        error: 'No type provided',
        field: 'type',
      };
    }

    if (typeof rawBody.email !== 'string') {
      throw {
        error: 'Email is required.',
        field: 'email',
      };
    }

    if (typeof rawBody.name !== 'string') {
      throw {
        error: 'Name is required.',
        field: 'name',
      };
    }

    if (typeof rawBody.preferredUsername !== 'string') {
      throw {
        error: 'Preferred Username is required.',
        field: 'preferredUsername',
      };
    }

    if (typeof rawBody.password !== 'string') {
      throw {
        error: 'Password is required.',
        field: 'password',
      };
    }

    this.uid = rawBody.uid;
    this.type = rawBody.type;
    this.email = rawBody.email;
    this.name = rawBody.name;
    this.preferredUsername = rawBody.preferredUsername;
    this.password = rawBody.password;
  }
}

export class UserPostEndpoint {
  routes: Routes;
  req: IncomingMessage;
  res: ServerResponse;
  core: CoreLibrary;
  plugins?: Plugin[];

  constructor(
    routes: Routes,
    req: IncomingMessage,
    res: ServerResponse,
    core: CoreLibrary,
    plugins?: Plugin[],
  ) {
    this.routes = routes;
    this.req = req;
    this.res = res;
    this.core = core;
    this.plugins = plugins;
  }

  protected createServerActor = createServerActor;
  protected createUserActor = createUserActor;

  public async respond() {
    const body: Record<string, unknown> = JSON.parse(
      await streamToString(this.req),
    );

    const user = await new Promise<User>((resolve) => {
      resolve(new User(body));
    }).catch((error: Record<string, string>) => {
      this.res.statusCode = 300;
      this.res.write(JSON.stringify(error));
      this.res.end();
    });

    if (!user) {
      return;
    }

    const isUsernameTaken = !!(await this.core.findOne('entity', {
      preferredUsername: user.preferredUsername,
    }));

    if (
      isUsernameTaken ||
      RESERVED_USERNAMES.includes(user.preferredUsername)
    ) {
      this.res.statusCode = 409;
      this.res.write(
        JSON.stringify({
          error: 'Username taken.',
          field: 'username',
        }),
      );
      this.res.end();
      return;
    }

    try {
      const { uid, token } = await this.core.createUser({
        email: user.email,
        password: user.password,
        preferredUsername: user.preferredUsername,
      });

      const isBotCreated = !!(await this.core.findOne('entity', {
        preferredUsername: SERVER_ACTOR_USERNAME,
      }));

      if (!isBotCreated) {
        await this.createServerActor();
      }

      await this.createUserActor(user, uid);

      this.res.statusCode = 200;
      this.res.write(
        JSON.stringify({
          token,
        }),
      );
      this.res.end();
    } catch (error) {
      this.res.statusCode = 300;
      this.res.write(
        JSON.stringify({
          error: error.toString(),
        }),
      );
      this.res.end();
    }
  }
}
