import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import {
  userPostHandler,
  homeGetHandler,
  entityGetHandler,
  outboxHandler,
  inboxHandler,
  sharedInboxHandler,
  webfingerHandler,
  remoteHandler,
} from 'activitypub-core-endpoints';
import { AP } from 'activitypub-core-types';
import { DeliveryService } from 'activitypub-core-delivery';
import type { Database, Auth } from 'activitypub-core-types';
import {
  CONTENT_TYPE_HEADER,
  HTML_CONTENT_TYPE,
  convertStringsToUrls,
} from 'activitypub-core-utilities';

export const activityPub =
  (
    {
      renderLogin,
      renderHome,
      renderEntity,
    }: {
      renderLogin: () => Promise<string>;
      renderHome: ({ actor }: { actor: AP.Actor }) => Promise<string>;
      renderEntity: ({
        entity,
        actor,
      }: {
        entity: AP.Entity;
        actor?: AP.Actor;
      }) => Promise<string>;
    },
    {
      authenticationService,
      databaseService,
      deliveryService,
    }: {
      authenticationService: Auth;
      databaseService: Database;
      deliveryService: DeliveryService;
    },
  ) =>
  async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
    console.log('INCOMING:', req.url);

    if (req.url === '/user' && req.method === 'POST') {
      await userPostHandler(req, res, authenticationService, databaseService);
      next();
      return;
    }

    if (req.url.startsWith('/.well-known/webfinger')) {
      await webfingerHandler(req, res, databaseService);
      next();
      return;
    }

    if (req.url.startsWith('/remote')) {
      await remoteHandler(req, res, authenticationService, databaseService);
      next();
      return;
    }

    if (req.url === '/sharedInbox' && req.method === 'POST') {
      await sharedInboxHandler(req, res, databaseService, deliveryService);
      next();
      return;
    }

    if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
      const result = await inboxHandler(
        req,
        res,
        authenticationService,
        databaseService,
        deliveryService,
      );

      if (result.props && Object.keys(result.props).length) {
        res.statusCode = 200;
        res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
        res.write(
          await renderEntity(
            convertStringsToUrls(result.props) as unknown as {
              entity: AP.Entity;
              actor?: AP.Actor;
            },
          ),
        );
        res.end();
      }
      return;
    }

    if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
      const result = await outboxHandler(
        req,
        res,
        authenticationService,
        databaseService,
        deliveryService,
      );
      if (
        result.props &&
        Object.keys(result.props).length &&
        'entity' in result.props
      ) {
        res.statusCode = 200;
        res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
        res.write(
          await renderEntity({
            entity: convertStringsToUrls(
              result.props.entity as unknown as { [key: string]: unknown },
            ) as AP.Entity,
            actor: convertStringsToUrls(
              result.props.actor as unknown as { [key: string]: unknown },
            ) as AP.Actor,
          }),
        );
        res.end();
      }
      return;
    }

    if (req.url === '/login' && req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      res.write(await renderLogin());
      res.end();
      return;
    }

    if (req.url === '/home' && req.method === 'GET') {
      const result = await homeGetHandler(
        req,
        res,
        authenticationService,
        databaseService,
      );

      if (result.redirect) {
        res.statusCode = 200;
        res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
        res.write(await renderLogin());
        res.end();
        return;
      }

      if (result.props && Object.keys(result.props).length) {
        res.statusCode = 200;
        res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
        res.write(
          await renderHome(
            convertStringsToUrls(result.props) as { actor: AP.Actor },
          ),
        );
        res.end();
        return;
      }

      res.statusCode = 500;
      res.end();
      return;
    }

    if (
      req.url.startsWith('/object/') ||
      req.url.startsWith('/actor/') ||
      req.url.startsWith('/activity/')
    ) {
      const result = await entityGetHandler(
        req,
        res,
        authenticationService,
        databaseService,
      );

      if (result.props && Object.keys(result.props).length) {
        res.statusCode = 200;
        res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
        res.write(
          await renderEntity(
            convertStringsToUrls(result.props) as unknown as {
              entity: AP.Entity;
              actor?: AP.Actor;
            },
          ),
        );
        res.end();
        return;
      }

      res.statusCode = 500;
      res.end();
      return;
    }

    console.log('404', req.url);
    next();
  };
