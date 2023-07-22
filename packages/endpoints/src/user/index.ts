import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
} from '@activity-kit/utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/core';

export class User {
  readonly type: string;
  readonly email: string;
  readonly name: string;
  readonly preferredUsername: string;
  readonly password: string;

  constructor(rawBody: Record<string, unknown>) {
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

    this.type = rawBody.type;
    this.email = rawBody.email;
    this.name = rawBody.name;
    this.preferredUsername = rawBody.preferredUsername;
    this.password = rawBody.password;
  }
}

export class UserPostEndpoint {
  body: Record<string, unknown>;
  routes: Routes;
  plugins?: Plugin[];

  constructor(
    readonly core: CoreLibrary,
    options: {
      body: Record<string, unknown>;
      routes: Routes;
      plugins?: Plugin[];
    },
  ) {
    this.body = options.body;
    this.routes = options.routes;
    this.plugins = options.plugins;
  }

  protected createServerActor = createServerActor;
  protected createUserActor = createUserActor;

  public async respond() {
    const result = await new Promise<User>((resolve) => {
      resolve(new User(this.body));
    }).catch((error: unknown) => {
      console.log(error);
      return new Error(`${error}`);
    });

    if (result instanceof Error) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Internal server error.',
        }),
      };
    }

    const user = result;

    const isUsernameTaken = !!(await this.core.findOne('entity', {
      preferredUsername: user.preferredUsername,
    }));

    if (
      isUsernameTaken ||
      RESERVED_USERNAMES.includes(user.preferredUsername)
    ) {
      return {
        statusCode: 409,
        body: JSON.stringify({
          error: 'Username taken.',
          field: 'username',
        }),
      };
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

      return {
        statusCode: 201,
        body: JSON.stringify({
          token,
        }),
      };
    } catch (error) {
      return {
        statusCode: 300,
        body: JSON.stringify({
          error: error.toString(),
        }),
      };
    }
  }
}
