import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { pathToRegexp, match as matchRegExpPath } from 'path-to-regexp';
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
} from '@activity-kit/endpoints';
import { Adapters, AP, Plugin, Routes } from '@activity-kit/types';
import {
  CONTENT_TYPE_HEADER,
  DEFAULT_ROUTES,
  HTML_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from '@activity-kit/utilities';
import { Core } from '@activity-kit/core';

export const activityKitPlugin =
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
    req: IncomingMessage & {
      params: Record<string, string>;
    },
    res: ServerResponse,
    next: NextFunction,
  ) => {
    console.log('INCOMING:', req.url);

    const core = new Core({
      auth: config.adapters.auth,
      crypto: config.adapters.crypto,
      db: config.adapters.db,
      storage: config.adapters.storage,
    });

    const routes: Routes = {
      ...DEFAULT_ROUTES,
      ...config.routes,
    };

    const matchesRoute = (path: string) =>
      new URL(req.url, LOCAL_DOMAIN).pathname.match(pathToRegexp(path));

    const getEntityRouteParams = () => {
      for (const route of Object.values(routes)) {
        if (matchesRoute(route)) {
          const matches = matchRegExpPath<Record<string, string>>(route)(
            req.url,
          );

          if (matches) {
            return matches.params;
          }
        }
      }

      for (const collectionRoute of [
        routes.serverInbox,
        routes.serverOutbox,
        routes.serverFollowers,
        routes.serverFollowing,
        routes.serverHashtags,
        routes.inbox,
        routes.outbox,
        routes.followers,
        routes.following,
        routes.liked,
        routes.stream,
        routes.hashtag,
        routes.likes,
        routes.shares,
        routes.replies,
      ]) {
        const collectionPageRoute =
          (collectionRoute === '/' ? '' : collectionRoute) + '/page/:page';

        if (matchesRoute(collectionPageRoute)) {
          const matches = matchRegExpPath<Record<string, string>>(
            collectionPageRoute,
          )(req.url);

          if (matches) {
            return matches.params;
          }
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
            core,
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
            core,
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
            core,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (matchesRoute(routes.endpoint)) {
          // TODO route endpoint
          await new UploadMediaPostEndpoint(
            routes,
            req,
            res,
            core,
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
            core,
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
          await new HomeGetEndpoint(req, res, core, config.plugins).respond(
            config.pages.home,
          );
          next();
          return;
        }

        if (req.url.startsWith('/proxy')) {
          await new ProxyGetEndpoint(req, res, core, config.plugins).respond();
          next();
          return;
        }

        if (req.url.startsWith('/.well-known/webfinger')) {
          await new WebfingerGetEndpoint(
            req,
            res,
            core,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url === '/.well-known/host-meta') {
          await new HostMetaGetEndpoint(
            req,
            res,
            core,
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
            core,
            config.plugins,
          ).respond();
          next();
          return;
        }

        const entityParams = getEntityRouteParams();

        if (entityParams) {
          req.params = entityParams;

          await new EntityGetEndpoint(req, res, core, config.plugins).respond(
            config.pages.entity,
          );
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
