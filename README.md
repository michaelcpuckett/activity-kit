# activitypub-core

This is a [Lerna](https://lerna.js.org/) monorepo that holds packages related to an implementation of the ActivityPub protocol specification.

[ActivityPub](https://activitypub.rocks) is a standardized method of exchanging social data.

## Current Status

This is a toy project at the moment. It's not fully working and it changes frequently.

See [TODO.md](TODO.md) and [CHECKLIST.md](CHECKLIST.md).

## Running in a Project

Canonical example using Firebase Auth, Express, MongoDB, JSX:

```ts
(async () => {
  const app = express();
  const authenticationAdapter = new FirebaseAuthentication(serviceAccount, '<project-id>');
  const dbAdapter = await new MongoDbAdapter().connect({
    mongoClientUrl: 'mongodb://localhost:27017',
  });
  const deliveryAdapter = new DeliveryAdapter(dbAdapter);

  app.use(
    activityPub(
      {
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
      },
      {
        authenticationAdapter,
        dbAdapter,
        deliveryAdapter,
      },
    ),
  );

  app.listen(process.env.PORT ?? 3000, () => {
    console.log('Running...');
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
papers over some of the complexity of JSON-LD, Activity Streams collections, etc.
to make getting started easy.

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

Currently this project comes with:

- `activitypub-core-mongodb`

* TODO: PostreSQL

#### Authentication Adapters

Current this project comes with:

- `activitypub-core-firebase-auth`

* TODO: Passport.js

#### Storage Adapters

Currently this project comes with:

- `activitypub-core-ftp-storage`

* TODO: AWS S3, Firebase Storage

#### Server Adapters

Currently this project comes with:

- `activitypub-core-express-middleware`

* TODO: Fastify, Next.js

### Plugins

In progress. Currently this project comes with:

- `activitypub-core-plugin-foaf`

### Client/Rendering Layer

TBD. Currently using JSX (React) server-side.