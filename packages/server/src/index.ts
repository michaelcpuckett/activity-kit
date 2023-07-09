import * as express from 'express';
import * as path from 'path';
import { MongoClient } from 'mongodb';

import { AP } from '@activity-kit/types';
import { MongoDbAdapter } from '@activity-kit/db-mongo';
import { TokenAuthAdapter } from '@activity-kit/auth-token';
import { NodeCryptoAdapter } from '@activity-kit/crypto-node';
import { FtpStorageAdapter } from '@activity-kit/storage-ftp';
import { streamToString } from '@activity-kit/utilities';

(async () => {
  // Use Express for all routes.
  const app = express.default();

  // Static files.
  app.use(express.static(path.resolve(__dirname, '../static')));

  const mongoClient = new MongoClient(
    process.env.AP_MONGO_CLIENT_URL ?? 'mongodb://127.0.0.1:27017',
  );
  await mongoClient.connect();
  const mongoDb = mongoClient.db(process.env.AP_MONGO_DB_NAME ?? 'activitypub');
  const mongoDbAdapter = new MongoDbAdapter(mongoDb);
  const nodeCryptoAdapter = new NodeCryptoAdapter();
  const tokenAuthAdapter = new TokenAuthAdapter({
    db: mongoDbAdapter,
    crypto: nodeCryptoAdapter,
  });

  app.post('/login', async (req, res, next) => {
    const body = JSON.parse(await streamToString(req));
    const email = body.email;
    const password = body.password;

    if (!email) {
      res.send({
        success: false,
        error: 'Email must be provided.',
      });
      next();
      return;
    }

    if (!password) {
      res.send({
        success: false,
        error: 'Password must be provided.',
      });
      next();
      return;
    }

    const result = await tokenAuthAdapter.authenticatePassword(email, password);

    res.send(
      result
        ? {
            success: true,
            token: result.token,
          }
        : {
            success: false,
            error: 'Invalid email and password combo.',
          },
    );
    next();
  });

  app.get('/', async (req, res, next) => {
    const htmlResponse = `<!DOCTYPE html>
        <html>
          <h1>Hello world</h1>
        </html>
    `;
    res.send(htmlResponse);
    next();
  });

  app.listen(process.env.PORT ?? process.env.AP_PORT ?? 3000, () => {
    console.log('Running...');
  });
})();
