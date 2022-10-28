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
import type { Database, Auth, Storage } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
} from 'activitypub-core-utilities';

export const activityPub = (
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
    },
    adapters: {
      authentication: Auth;
      database: Database;
      delivery: DeliveryAdapter;
      storage: Storage;
    },
    plugins?: Plugin[]
  ) =>
    async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
      console.log('INCOMING:', req.url, 'FROM:', req.headers.referer ?? req.socket.remoteAddress);

      if (req.method === 'POST') {
        if (req.url === '/user') {
          await new UserPostEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }

        if (req.url === '/sharedInbox') {
          await new SharedInboxPostEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }

        if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
          await new InboxPostEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }

        if (req.url.startsWith('/actor/') && req.url.endsWith('/uploadMedia')) {
          await new UploadMediaPostEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }

        if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
          await new OutboxPostEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }
      }

      if (req.method === 'GET') {
        if (req.url === '/login') {
          res.statusCode = 200;
          res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
          res.write(await pages.login());
          res.end();
          next();
          return;
        }

        if (req.url === '/home') {
          await new HomeGetEndpoint(
            req,
            res,
            adapters,
            plugins,
          ).respond(pages.home);
          next();
          return;
        }

        if (req.url.startsWith('/.well-known/webfinger')) {
          await new WebfingerGetEndpoint(req, res, adapters, plugins).respond();
          next();
          return;
        }

        if (
          req.url.startsWith('/object/') ||
          req.url.startsWith('/actor/') ||
          req.url.startsWith('/activity/')
        ) {
          await new EntityGetEndpoint(
            req,
            res,
            adapters,
            plugins,
          ).respond(pages.entity);
          next();
          return;
        }
      }

      console.log('Not handled:', req.url);
      next();
    };