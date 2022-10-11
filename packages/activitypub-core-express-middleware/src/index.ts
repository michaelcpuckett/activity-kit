import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { userPostHandler, homeGetHandler, entityGetHandler, outboxHandler, inboxHandler } from 'activitypub-core';
import { AP } from 'activitypub-core-types';
import type { ServiceAccount } from 'firebase-admin';
import type { Database, DeliveryService } from 'activitypub-core-types';

export const activityPub = ({
  renderIndex,
  renderHome,
  renderEntity,
}: {
  renderIndex: () => Promise<string>,
  renderHome: ({ actor }: { actor: AP.Actor }) => Promise<string>,
  renderEntity: ({ entity }: { entity: AP.Entity }) => Promise<string>,
}, {
  serviceAccount,
  databaseService,
  deliveryService,
}: {
  serviceAccount: ServiceAccount,
  databaseService: Database,
  deliveryService: DeliveryService,
}) => async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
  if (req.url === '/user' && req.method === 'POST') {
    await userPostHandler(req, res, serviceAccount);
    next();
    return;
  }

  if (req.url.startsWith('actor/') && req.url.endsWith('/inbox')) {
    await inboxHandler(req, res, databaseService, deliveryService);
    next();
    return;
  }

  if (req.url.startsWith('actor/') && req.url.endsWith('/outbox')) {
    await outboxHandler(req, res, databaseService, deliveryService);
    next();
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.write(await renderIndex());
    res.end();
    next();
    return;
  }

  if (req.url === '/home' && req.method === 'GET') {
    const result = await homeGetHandler(req, res, serviceAccount, databaseService);

    if (result.redirect) {
      next();
      return;
    }

    if (result.props) {
      res.statusCode = 200;
      res.write(await renderHome(result.props as { actor: AP.Actor }));
      res.end();
      next();
      return;
    }

    res.statusCode = 500;
    res.end();
    next();
    return;
  }

  if (req.url.startsWith('/object/') || req.url.startsWith('/actor/') || req.url.startsWith('/activity')) {
    const result = await entityGetHandler(req, res, databaseService);

    if (result.props) {
      res.statusCode = 200;
      res.write(await renderEntity(result.props as { entity: AP.Entity }));
      res.end();
      next();
      return;
    }

    res.statusCode = 500;
    res.end();
    next();
    return;
  }

  next();
};