import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { pathToRegexp } from 'path-to-regexp';
import {
  UserPostEndpoint,
  HomeGetEndpoint,
  EntityGetEndpoint,
  OutboxPostEndpoint,
  InboxPostEndpoint,
  SharedInboxPostEndpoint,
  WebfingerGetEndpoint,
  UploadMediaPostEndpoint,
  HostMetaGetEndpoint,
  NodeinfoGetEndpoint,
  ProxyGetEndpoint,
} from 'activitypub-core-endpoints';
import { AP, Plugin } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
import type {
  DbAdapter,
  AuthAdapter,
  StorageAdapter,
  Routes,
} from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
} from 'activitypub-core-utilities';

export const activityPub =
  (config: {
    routes?: Partial<Routes>;

    pages: {
      login: () => Promise<string>;

      home: ({ actor }: { actor: AP.Actor }) => Promise<string>;

      entity: ({
        entity,
        actor,
      }: {
        entity: AP.Entity;
        actor?: AP.Actor;
      }) => Promise<string>;
    };

    adapters: {
      auth: AuthAdapter;
      db: DbAdapter;
      delivery: DeliveryAdapter;
      storage: StorageAdapter;
    };

    plugins?: Plugin[];
  }) =>
  async (
    req: IncomingMessage & { hostname: string },
    res: ServerResponse,
    next: NextFunction,
  ) => {
    console.log('INCOMING:', req.url);

    const routes: Routes = {
      actor: '/@:username',
      inbox: '/@:username/inbox',
      outbox: '/@:username/outbox',
      followers: '/@:username/followers',
      following: '/@:username/following',
      liked: '/@:username/liked',
      shared: '/@:username/shared',
      uploadMedia: '/@:username/uploadMedia',
      blocked: '/@:username/blocked',

      object: '/:type/:id',
      activity: '/:type/:id',
      likes: '/:type/:id/likes',
      shares: '/:type/:id/shares',
      replies: '/:type/:id/replies',
      ...config.routes,
    };

    const matches = (path: string) => req.url.match(pathToRegexp(path));

    try {
      if (req.method === 'POST') {
        if (req.url === '/user') {
          await new UserPostEndpoint(
            routes,
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url === '/sharedInbox') {
          await new SharedInboxPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matches(routes.inbox)) {
          await new InboxPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matches(routes.uploadMedia)) {
          await new UploadMediaPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matches(routes.inbox)) {
          await new OutboxPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }
      }

      if (req.method === 'GET') {
        if (req.url === '/login') {
          res.statusCode = 200;
          res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
          res.write(await config.pages.login());
          res.end();
          next();
          return;
        }

        if (req.url.startsWith('/home')) {
          await new HomeGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond(config.pages.home);
          next();
          return;
        }

        if (req.url.startsWith('/proxy')) {
          await new ProxyGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url === '/.well-known/webfinger') {
          await new WebfingerGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url === '/.well-known/host-meta') {
          await new HostMetaGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (
          req.url.startsWith('/.well-known/nodeinfo') ||
          req.url.startsWith('/nodeinfo')
        ) {
          await new NodeinfoGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (
          matches(routes.actor) ||
          matches(routes.following) ||
          matches(routes.followers) ||
          matches(routes.liked) ||
          matches(routes.likes) ||
          matches(routes.replies) ||
          matches(routes.shared) ||
          matches(routes.shares) ||
          matches(routes.blocked) ||
          matches(routes.inbox) ||
          matches(routes.outbox)
          // (() => {
          //   for (const plugin of config.plugins) {
          //     if ('getIsEntityGetRequest' in plugin) {
          //       if (plugin.getIsEntityGetRequest(req.url)) {
          //         return true;
          //       }
          //     }
          //   }
          // })()
        ) {
          await new EntityGetEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond(config.pages.entity);
          next();
          return;
        }
      }
    } catch (error: unknown) {
      console.trace(error);
      next(new Error(`${error}`));
      return;
    }

    console.log('Not handled:', req.url);
    next();
  };
