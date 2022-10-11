import type { NextFunction } from 'express';
import type { IncomingMessage, ServerResponse } from 'http';
import { userPostHandler, homeGetHandler, entityGetHandler } from 'activitypub-core';
import { AP } from 'activitypub-core-types/src';
import type { ServiceAccount } from 'firebase-admin';

export const activityPub = ({
  renderIndex,
  renderHome,
  renderEntity,
}: {
  renderIndex: () => Promise<string>,
  renderHome: ({ actor }: { actor: AP.Actor }) => Promise<string>,
  renderEntity: ({ entity }: { entity: AP.Entity }) => Promise<string>,
}, serviceAccount: ServiceAccount) => async (req: IncomingMessage, res: ServerResponse, next: NextFunction) => {
  if (req.url === '/user' && req.method === 'POST') {
    await userPostHandler(req, res, serviceAccount);
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
    const result = await homeGetHandler(req, res, serviceAccount);

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
    const result = await entityGetHandler(req, res);

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