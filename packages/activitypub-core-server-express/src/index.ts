import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
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

        if (req.url.endsWith('/inbox')) {
          await new InboxPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url.endsWith('/uploadMedia')) {
          await new UploadMediaPostEndpoint(
            req,
            res,
            config.adapters,
            config.plugins,
          ).respond();
          next();
          return;
        }

        if (req.url.endsWith('/outbox')) {
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

        if (req.url.startsWith('/.well-known/host-meta')) {
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
          req.url.startsWith('/@') ||
          req.url.startsWith('/entity/') ||
          req.url.endsWith('/following') ||
          req.url.endsWith('/followers') ||
          req.url.endsWith('/liked') ||
          req.url.endsWith('/likes') ||
          req.url.endsWith('/replies') ||
          req.url.endsWith('/shared') ||
          req.url.endsWith('/shares') ||
          req.url.endsWith('/blocked') ||
          req.url.endsWith('/blocks') ||
          req.url.endsWith('/groups') ||
          req.url.endsWith('/bookmarks') ||
          req.url.endsWith('/friends') ||
          req.url.endsWith('/members') ||
          req.url.endsWith('/inbox') ||
          req.url.endsWith('/outbox') ||
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
