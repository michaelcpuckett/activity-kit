import React from 'react';
import express from 'express';
import { activityPub } from 'activitypub-core-express-middleware';
import { IndexPage, EntityPage, HomePage } from 'activitypub-core-jsx-components';
import { renderToString } from 'react-dom/server';
import serviceAccount from './credentials';

const app = express();

app.use(express.static('src/static'));
app.use(activityPub({
  renderIndex: async () => {
    return renderToString(<IndexPage />);
  },
  renderEntity: async ({ entity }) => {
    return renderToString(<EntityPage entity={entity} />);
  },
  renderHome: async ({ actor }) => {
    return renderToString(<HomePage actor={actor} />);
  },
}, serviceAccount))

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Running...');
});