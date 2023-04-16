import {
  RESERVED_USERNAMES,
  SERVER_ACTOR_USERNAME,
  streamToString,
} from '@activity-kit/utilities';
import { createServerActor } from './createServerActor';
import { createUserActor } from './createUserActor';
import type { IncomingMessage, ServerResponse } from 'http';
import { CoreLibrary, Plugin, Routes } from '@activity-kit/types';

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
    const body: { [key: string]: string } = JSON.parse(
      await streamToString(this.req),
    );

    const { email, type, password, name, preferredUsername } = body;

    if (!email) {
      this.res.statusCode = 300;
      this.res.write(
        JSON.stringify({
          error: 'Email is required.',
          field: 'email',
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
          field: 'password',
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
          field: 'username',
        }),
      );
      this.res.end();
      return;
    }

    const isUsernameTaken = !!(await this.core.findOne('entity', {
      preferredUsername,
    }));

    if (isUsernameTaken || RESERVED_USERNAMES.includes(preferredUsername)) {
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
        email,
        password,
        preferredUsername,
      });

      const isBotCreated = !!(await this.core.findOne('entity', {
        preferredUsername: SERVER_ACTOR_USERNAME,
      }));

      if (!isBotCreated) {
        await this.createServerActor();
      }

      await this.createUserActor({
        uid,
        type,
        email,
        preferredUsername,
        name,
      });

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
