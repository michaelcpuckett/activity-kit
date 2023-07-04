# ActivityKit

This is a [Lerna](https://lerna.js.org/) monorepo that holds packages related to a TypeScript implementation of the ActivityPub protocol.

[ActivityPub](https://activitypub.rocks) is a standardized method of exchanging social data.

## Current Status

This project is still incomplete at the moment. Much of the core functionality is complete, but refer to:

- [TODO.md](TODO.md)
- [CHECKLIST.md](CHECKLIST.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## Running in a Project

### Prerequesities

In addition to hosting a (Node) server, you will also need:

- **Database**: A compatable database that the server can access.
- **Storage**: A way to store files such as profile pics.
- **HTML Templating**: A way to render pages with provided JSON data.

### Example

Canonical example using Express + MongoDB + FTP:

```ts
import * as express from "express";
import { MongoClient } from "mongodb";

import { AP, Adapters } from "@activity-kit/types";
import { activityKitPlugin } from "@activity-kit/server-express";
import { MongoDbAdapter } from "@activity-kit/db-mongo";
import { TokenAuthAdapter } from "@activity-kit/auth-token";
import { NodeCryptoAdapter } from "@activity-kit/crypto-node";
import { FtpStorageAdapter } from "@activity-kit/storage-ftp";

// Use Express for all routes.
const app = express.default();

(async () => {
  const ftpStorageAdapterOptions = {
    user: process.env.AP_FTP_USER,
    password: process.env.AP_FTP_PASSWORD,
    host: process.env.AP_FTP_HOST,
    path: process.env.AP_FTP_PATH,
  };

  // Use the FTP adapter for handling uploaded media.
  const ftpStorageAdapter = new FtpStorageAdapter(ftpStorageAdapterOptions);

  // Use MongoDB to store data.
  const mongoClient = new MongoClient(process.env.AP_MONGO_CLIENT_URL);
  await mongoClient.connect();
  const mongoDb = mongoClient.db("activitypub");
  const mongoDbAdapter = new MongoDbAdapter(mongoDb);

  // Use Node's Crypto library + Mongo for authentication.
  const nodeCryptoAdapter = new NodeCryptoAdapter();
  const cryptoAuthAdapter = new CryptoAuthAdapter({
    db: mongoDbAdapter,
    crypto: nodeCryptoAdapter,
  });

  // Use the ActivityKit Express plugin.
  app.use(
    activityKitPlugin({
      adapters: {
        auth: cryptoAuthAdapter,
        crypto: nodeCryptoAdapter,
        db: mongoDbAdapter,
        storage: ftpStorageAdapter,
      },

      plugins: [],

      routes: {},

      pages: {
        // Login/Signup via Auth adapter.
        login: async (): Promise<string> => {
          // Use a rendering engine to generate and return a string here.
          return `
            <html>
              <!-- Signup form POSTs to /user endpoint to create new user. -->
              <form>...</form>
              <!-- Login form POSTs to /login endpoint to get cookie token. -->
              <form>...</form>
            </html>
          `;
        },

        // Logged-in users can edit their profile, create new posts, etc.
        home: async (homePageProps: {
          actor: AP.Actor;
          shared: AP.Announce[];
          requests: AP.Follow[];
          members: AP.Actor[];
          blocks: AP.Block[];
        }): Promise<string> => {
          // Use a rendering engine to generate and return a string here.
          return `
            <html>
              <title>@${actor.preferredUsername}</title>
              <!-- Forms POST to user's outbox URL using AP protocol. -->
              <form>...</form>
            </html>
          `;
        },

        // All ActivityPub entities have an HTML view.
        entity: async (entityPageProps: {
          entity: AP.Entity;
          actor?: AP.Actor;
        }): Promise<string> => {
          // Use a rendering engine to generate and return a string here.
          return `
            <html>
              <h1>${entity.type}</h1>
              <p>${entity.summary}</p>
            </html>
          `;
        },
      },
    })
  );

  app.listen(process.env.PORT ?? 3000, () => {
    console.log("Running...");
  });
})();
```

## General Philosophy

This project aims to be spec-compliant.

This project aims to be as versatile and non-opinionated as possible. The hope is to be able to integrate with any project.

This project is MIT-licensed, with the hope it will be forked, reused, or
wholly included in other projects due to this permissive license. There may be similiar software that exists, but inclusion would be inviable due to licensing restrictions.

## Architecture

This project aims to be agnostic as to how the data is stored, which server is used, etc. Adapters that conform to a specific interface can be mixed and matched.

Additionally, Plugins can modify the endpoints.

### Core Layer

The core layer that gets included in all projects include these packages:

- `@activity-kit/types`
  - The Activity vocabularies converted to TypeScript types.
- `@activity-kit/endpoints`
  - The logic for carrying out the bulk of the ActivityPub protocol.
- `@activity-kit/core`
  - Common functions that depend on the Adapter APIs.
- `@activity-kit/utilities`
  - Common functions with no dependencies on packages from upper layers.

### Adapaters

#### Database Adapaters

There is a large amount of data related to profiles and interactions that must be persisted over time.

Currently this project comes with:

- `@activity-kit/db-mongo`
- `@activity-kit/db-sqlite`
- TODO: `@activity-kit/db-postgresql`
- TODO: `@activity-kit/db-d1`

#### Authentication Adapters

Users need to be able to sign up and log in to their account.

Current this project comes with:

- `@activity-kit/auth-token`
  - Generates tokens via Crypto APIs and stores them in the provided database.
- `@activity-kit/auth-firebase`
  - Wrapper around `@firebase/auth`

#### Storage Adapters

Users must be able to upload media, such as profile pictures or attachments.

Currently this project comes with:

- `@activity-kit/storage-ftp`
  - Uploads media via FTP with the provided credentials.
- TODO: `@activity-kit/storage-s3`
  - Upload media via S3-compatible storage APIs.

#### Server Adapters

The server must handle the core endpoint requests.

Currently this project comes with:

- `@activity-kit/server-express`
- TODO: `@activity-kit/server-fastify`
- TODO: `@activity-kit/server-serverless`
- TODO: `@activity-kit/server-koa`

#### Crypto Adapters

There are a few instances that require using native cryptography APIs, such as generating Actors' public/private key pairs.

Typically this will be handled by Node's `crypto` library, but the crypto functions are abstracted to also enable support running within a web worker context.

- `@activity-kit/crypto-node`
- TODO: `@activity-kit/crypto-browser`

#### Email Adapters

In the future, email will be an optional adapter that can be used to reset passwords and send notifications to users.

- TODO: `@activity-kit/email-nodemailer`

### Plugins

Plugins provide lifecycle hooks that can modify core functionality.

You can write your own.

Currently this project comes with:

- `@activity-kit/plugin-groups`
- TODO: `@activity-kit/single-user`

### Client/Rendering Layer

This project does not aim to provide any HTML code for client rendering.

The `pages` configuration properties expect a callback function that renders an HTML string, leaving the front-end mostly to the host app.

The front-end should utilize ActivityPub's Client-to-Server protocol to post Activities on behalf of users.

## Use Cases

There are a few use cases this project attempts to fulfill. Ideally this project papers over some of the complexity of JSON-LD, Activity Streams collections, etc. to make getting started easy.

### Connecting a Blog to the Fediverse

Someone already has an HTML blog and a domain name and wants their posts to be read by others and get replies. Instead of setting up a CMS, they decide to set up an ActivityPub server.

### Single-Server Social Feeds

An exercise app wants to build in social features to make their users feel
proud of their achievements. This would probably include something like a
notification bell and a feed where updates about their friends appear. Users might have with the option to react with an emoji or sticker.

All these exchanges would stay local to the server.

### Private Group Chat

A small group of people who communicate online become dissatisfied with their existing app's policies and decide to communicate privately. They would like to develop their own system for communication.

Although ActivityPub does not define an encryption layer, messages could stay local to a single server or could be exchanged between all parties in an ephermeral way. Encryption could be a good addition, however.

### Federated Social Network

Ideally this project could be used to build an entire social network that
interfaces with the rest of the Fediverse.
