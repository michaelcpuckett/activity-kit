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
} from 'activitypub-core-endpoints';
import { AP, Plugin } from 'activitypub-core-types';
import { DeliveryAdapter } from 'activitypub-core-delivery';
import type { DbAdapter, AuthAdapter, StorageAdapter } from 'activitypub-core-types';
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
  async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    console.log('INCOMING:', req.url);

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

      if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
        await new InboxPostEndpoint(
          req,
          res,
          config.adapters,
          config.plugins,
        ).respond();
        next();
        return;
      }

      if (req.url.startsWith('/actor/') && req.url.endsWith('/uploadMedia')) {
        await new UploadMediaPostEndpoint(
          req,
          res,
          config.adapters,
          config.plugins,
        ).respond();
        next();
        return;
      }

      if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
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

      if (req.url === '/home') {
        await new HomeGetEndpoint(
          req,
          res,
          config.adapters,
          config.plugins,
        ).respond(config.pages.home);
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

      if (
        req.url.startsWith('/object/') ||
        req.url.startsWith('/actor/') ||
        req.url.startsWith('/activity/') ||
        (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) ||
        (req.url.startsWith('/actor/') && req.url.endsWith('/outbox'))
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

    console.log('Not handled:', req.url);
    next();
  };
