import React from 'react';
import express from 'express';
import { activityPub } from 'activitypub-core-express-middleware';
import { IndexPage, EntityPage, HomePage } from 'activitypub-core-jsx-components';
import { renderToString } from 'react-dom/server';
import serviceAccount from './credentials';
import { MongoDatabaseService } from 'activitypub-core-mongodb';
import { DeliveryService } from 'activitypub-core-delivery';

(async () => {
  const app = express();
  const databaseService = await new MongoDatabaseService().connect();
  const deliveryService = new DeliveryService(databaseService);

  app.use(express.static('node_modules/activitypub-core-jsx-components/static'));
  app.use(activityPub({
    renderIndex: async () => {
      return `
        <!doctype html>
        ${renderToString(<IndexPage />)}`;
    },
    renderEntity: async ({ entity, actor }) => {
      return `
        <!doctype html>
        ${renderToString(<EntityPage entity={entity} actor={actor} />)}
      `;
    },
    renderHome: async ({ actor }) => {
      return `
        <!doctype html>
        ${renderToString(<HomePage actor={actor} />)}
      `;
    },
  }, {
    databaseService,
    deliveryService,
    serviceAccount
  }));

  app.listen(process.env.PORT ?? 3000, () => {
    console.log('Running...');
  });
})();
