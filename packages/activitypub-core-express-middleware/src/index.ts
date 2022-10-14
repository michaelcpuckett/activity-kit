import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { userPostHandler, homeGetHandler, entityGetHandler, outboxHandler, inboxHandler } from 'activitypub-core';
import { AP } from 'activitypub-core-types';
import type { ServiceAccount } from 'firebase-admin';
import { DeliveryService } from 'activitypub-core-delivery';
import type { Database } from 'activitypub-core-types/index';
import { CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE, convertStringsToUrls } from 'activitypub-core-utilities';

export const activityPub = ({
  renderIndex,
  renderHome,
  renderEntity,
}: {
  renderIndex: () => Promise<string>,
  renderHome: ({ actor }: { actor: AP.Actor }) => Promise<string>,
  renderEntity: ({ entity, actor }: { entity: AP.Entity; actor?: AP.Actor; }) => Promise<string>,
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
    await userPostHandler(req, res, serviceAccount, databaseService);
    next();
    return;
  }

  if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
    const result = await inboxHandler(req, res, serviceAccount, databaseService, deliveryService);

    if (result.props && Object.keys(result.props).length) {
      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      res.write(await renderEntity(convertStringsToUrls(result.props) as unknown as { entity: AP.Entity; actor?: AP.Actor; }));
      res.end();
    }
    return;
  }

  if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
    const result = await outboxHandler(req, res, serviceAccount, databaseService, deliveryService);
    if (result.props && Object.keys(result.props).length && 'entity' in result.props) {
      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      res.write(await renderEntity({
        entity: convertStringsToUrls(result.props.entity as unknown as { [key: string]: unknown }) as AP.Entity,
        actor: convertStringsToUrls(result.props.actor as unknown as { [key: string]: unknown }) as AP.Actor,
      }));
      res.end();
    }
    return;
  }

  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
    res.write(await renderIndex());
    res.end();
    return;
  }

  if (req.url === '/home' && req.method === 'GET') {
    const result = await homeGetHandler(req, res, serviceAccount, databaseService);

    if (result.redirect) {
      next();
      return;
    }

    if (result.props && Object.keys(result.props).length) {
      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      res.write(await renderHome(convertStringsToUrls(result.props) as { actor: AP.Actor }));
      res.end();
      return;
    }

    res.statusCode = 500;
    res.end();
    return;
  }

  if (req.url.startsWith('/object/') || req.url.startsWith('/actor/') || req.url.startsWith('/activity/')) {
    const result = await entityGetHandler(req, res, serviceAccount, databaseService);

    if (result.props && Object.keys(result.props).length) {
      res.statusCode = 200;
      res.setHeader(CONTENT_TYPE_HEADER, HTML_CONTENT_TYPE);
      res.write(await renderEntity(convertStringsToUrls(result.props) as unknown as { entity: AP.Entity; actor?: AP.Actor; }));
      res.end();
      return;
    }

    res.statusCode = 500;
    res.end();
    return;
  }

  next();
};