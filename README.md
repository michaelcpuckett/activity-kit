# activitypub-core

This is a [Lerna](https://lerna.js.org/) monorepo that holds packages related to an implementation of the ActivityPub protocol specification.

[ActivityPub](https://activitypub.rocks) is a standardized method of exchanging social data.

## Current Status

This project is still incomplete at the moment. Much of the core functionality is complete, but refer to:

- [TODO.md](TODO.md)
- [CHECKLIST.md](CHECKLIST.md)
- [CONTRIBUTING.md](CONTRIBUTING.md)

## Running in a Project

Canonical example using Express, MongoDB, custom Crypto Auth:

```ts
import * as express from "express";
import { MongoClient } from "mongodb";

import { AP, Adapters } from "activitypub-core-types";
import { activityPub } from "activitypub-core-server-express";
import { MongoDbAdapter } from "activitypub-core-db-mongo";
import { CryptoAuthAdapter } from "activitypub-core-auth-crypto";
import { NodeCryptoAdapter } from "activitypub-core-crypto-node";
import { FtpStorageAdapter } from "activitypub-core-storage-ftp";
import { DeliveryAdapter } from "activitypub-core-delivery";
import { streamToString } from "activitypub-core-utilities";

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
  const ftpStorageAdapter: Adapters["storage"] = new FtpStorageAdapter(
    ftpStorageAdapterOptions
  );

  // Use Node's Crypto library for cryptography.
  const nodeCryptoAdapter: Adapters["crypto"] = new NodeCryptoAdapter();

  const mongoClient = new MongoClient(process.env.AP_MONGO_CLIENT_URL);
  await mongoClient.connect();
  const mongoDb = mongoClient.db("activitypub");

  // Use MongoDB to store data.
  const mongoDbAdapter: Adapters["db"] = new MongoDbAdapter(mongoDb, {
    crypto: nodeCryptoAdapter,
  });

  // Use Node's Crypto library for authentication.
  const cryptoAuthAdapter: Adapters["auth"] = new CryptoAuthAdapter({
    db: mongoDbAdapter,
    crypto: nodeCryptoAdapter,
  });

  // Use the default Delivery adapter for Server-to-Server federation.
  const defaultDeliveryAdapter: Adapters["delivery"] = new DeliveryAdapter({
    adapters: {
      db: mongoDbAdapter,
      crypto: nodeCryptoAdapter,
    },
  });

  // Use the activitypub-core Express plugin.
  app.use(
    activityPub({
      adapters: {
        crypto: nodeCryptoAdapter,
        auth: cryptoAuthAdapter,
        db: mongoDbAdapter,
        delivery: defaultDeliveryAdapter,
        storage: ftpStorageAdapter,
      },

      plugins: [],

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

        // All ActivityPub objects have an HTML view.
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

This project aims to be an non-opinionated as possible, providing abstracted
layers that can hopefully work with any Node.js project.

This project is MIT-licensed, with the hope it will be forked, reused, or
wholly included in other projects due to this permissive license. There may be
similiar software that exists, but inclusion would be inviable due to licensing
restrictions.

## Use Cases

There are a few use cases this project attempts to fulfill. Ideally this project
papers over some of the complexity of JSON-LD, Activity Streams collections, etc. to make getting started easy.

### Connecting a Blog to the Fediverse

Someone already has an HTML blog and a domain name and wants their posts to be
read by others and get replies. Instead of setting up a CMS, they decide to set
up an ActivityPub server.

### Single-Server Social Feeds

An exercise app wants to build in social features to make their users feel
proud of their achievements. This would probably include something like a
notification bell and a feed where updates about their friends appear. Users
might have with the option to react with an emoji or sticker.

All these exchanges would stay local to the server.

### Private Group Chat

A small group of people who communicate online become dissatisfied with their
existing app's policies and decide to communicate privately. They would like to
develop their own system for communication.

Although ActivityPub does not define an encryption layer, messages could stay
local to a single server or could be exchanged between all parties in an
ephermeral way. Encryption could be a good addition, however.

### Federated Social Network

Ideally this project could be used to build an entire social network that
interfaces with the rest of the Fediverse.

## Architecture

This project aims to be agnostic as to how the data is stored, which server is
used, etc. Adapters that conform to a specific interface can be mixed and matched.

Additionally, plugins can modify the endpoints.

### Logic Layer

The logic layer that get included in all projects include these packages:

- `activitypub-core-types`
  - The Activity vocabularies converted to TypeScript types.
- `activitypub-core-endpoints`
  - The logic for carrying out the bulk of the ActivityPub protocol.
- `activitypub-core-delivery`
  - The logic specific to the Server-to-Server delivery (federation).
- `activitypub-core-utilities`
  - Common functions with no dependencies on packages from upper layers.

### Adapaters

#### Database Adapaters

There is a large amount of data related to profiles and interactions that must be persisted over time.

Currently this project comes with:

- `activitypub-core-db-mongo`
- `activitypub-core-db-sqlite`

* TODO: PostreSQL

#### Authentication Adapters

Users can sign up and log in to their account.

Current this project comes with:

- `activitypub-core-auth-crypto`
- `activitypub-core-auth-firebase`

#### Storage Adapters

Allows for users to upload media, such as profile pictures or attachments.

Currently this project comes with:

- `activitypub-core-storage-ftp`

* TODO: AWS S3, Firebase Storage

#### Server Adapters

The server must handle the core endpoint requests.

Currently this project comes with:

- `activitypub-core-server-express`

* TODO: Fastify, Next.js

### Plugins

In progress.

Injectables that can modify core functionality.

Currently this project comes with:

- `activitypub-core-plugin-groups`

### Client/Rendering Layer

TBD.
