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
import { Adapters, AP, Plugin } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
import type {
  DbAdapter,
  AuthAdapter,
  StorageAdapter,
  Routes,
} from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  DEFAULT_ROUTES,
  HTML_CONTENT_TYPE,
  LOCAL_DOMAIN,
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

    adapters: Adapters;

    plugins?: Plugin[];
  }) =>
  async (
    req: IncomingMessage & { hostname: string },
    res: ServerResponse,
    next: NextFunction,
  ) => {
    console.log('INCOMING:', req.url);

    const routes: Routes = {
      ...DEFAULT_ROUTES,
      ...config.routes,
    };

    const matchesRoute = (path: string) =>
      new URL(req.url, LOCAL_DOMAIN).pathname.match(pathToRegexp(path));

    const matchesEntityRoute = () => {
      for (const route of Object.values(routes)) {
        if (matchesRoute(route)) {
          return true;
        }
      }

      return false;
    };

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
            routes,
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matchesRoute(routes.inbox)) {
          await new InboxPostEndpoint(
            routes,
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matchesRoute(routes.endpoint)) {
          // TODO
          await new UploadMediaPostEndpoint(
            routes,
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matchesRoute(routes.outbox)) {
          await new OutboxPostEndpoint(
            routes,
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

        if (req.url.startsWith('/.well-known/webfinger')) {
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

        if (matchesEntityRoute()) {
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
