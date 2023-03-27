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
} from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
} from 'activitypub-core-utilities';

export const activityPub =
  (config: {
    routes?: {
      actor?: string | ((actor: string) => string);
      inbox?: string | ((actor: string) => string);
      outbox?: string | ((actor: string) => string);
      followers?: string | ((actor: string) => string);
      following?: string | ((actor: string) => string);
      liked?: string | ((actor: string) => string);
      shared?: string | ((actor: string) => string);
      blocked?: string | ((actor: string) => string);
      uploadMedia?: string | ((actor: string) => string);

      activity?: string | ((id: string, type: string) => string);
      object?: string | ((id: string, type: string) => string);
      likes?: string | ((id: string, type: string) => string);
      shares?: string | ((id: string, type: string) => string);
      replies?: string | ((id: string, type: string) => string);
    };
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

    const routes = {
      actor: '/@:actor',
      object: '/:type/:id',
      activity: '/:type/:id',
      inbox: '/@:actor/inbox',
      outbox: '/@:actor/outbox',
      followers: '/@:actor/followers',
      following: '/@:actor/following',
      liked: '/@:actor/liked',
      shared: '/@:actor/shared',

      uploadMedia: '/@:actor/uploadMedia',
      collections: '/@:actor/collection/:id',
      blocked: '/@:actor/blocked',
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

        if (
          matches(
            typeof routes.inbox === 'function'
              ? routes.inbox(':actor')
              : routes.inbox,
          )
        ) {
          await new InboxPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (
          matches(
            typeof routes.uploadMedia === 'function'
              ? routes.uploadMedia(':actor')
              : routes.uploadMedia,
          )
        ) {
          await new UploadMediaPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (
          matches(
            typeof routes.inbox === 'function'
              ? routes.inbox(':actor')
              : routes.inbox,
          )
        ) {
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
          matches(
            typeof routes.actor === 'function'
              ? routes.actor(':actor')
              : routes.actor,
          ) ||
          matches(
            typeof routes.following === 'function'
              ? routes.following(':actor')
              : routes.following,
          ) ||
          matches(
            typeof routes.followers === 'function'
              ? routes.followers(':actor')
              : routes.followers,
          ) ||
          matches(
            typeof routes.liked === 'function'
              ? routes.liked(':actor')
              : routes.liked,
          ) ||
          matches(
            typeof routes.likes === 'function'
              ? routes.likes(':id', ':type')
              : routes.likes,
          ) ||
          matches(
            typeof routes.replies === 'function'
              ? routes.replies(':id', ':type')
              : routes.replies,
          ) ||
          matches(
            typeof routes.shared === 'function'
              ? routes.shared(':actor')
              : routes.shared,
          ) ||
          matches(
            typeof routes.shares === 'function'
              ? routes.shares(':id', ':type')
              : routes.shares,
          ) ||
          matches(
            typeof routes.blocked === 'function'
              ? routes.blocked(':actor')
              : routes.blocked,
          ) ||
          matches(
            typeof routes.inbox === 'function'
              ? routes.inbox(':actor')
              : routes.inbox,
          ) ||
          matches(
            typeof routes.outbox === 'function'
              ? routes.outbox(':actor')
              : routes.outbox,
          ) ||
          (() => {
            for (const plugin of config.plugins) {
              if ('getIsEntityGetRequest' in plugin) {
                if (plugin.getIsEntityGetRequest(req.url)) {
                  return true;
                }
              }
            }
          })()
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
