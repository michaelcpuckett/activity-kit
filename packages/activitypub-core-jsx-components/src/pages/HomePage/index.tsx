import { AP } from 'activitypub-core-types';
import { Welcome } from './Welcome';
import { Sidebar } from './Sidebar';
import { CreateForm } from './CreateForm';
import { OrderedCollectionEntity } from '../EntityPage/OrderedCollection';
import { CollectionEntity } from '../EntityPage/Collection';
import React from 'react';

type Data = {
  actor: AP.Actor;
}

export function HomePage({
  actor
}: Data) {
  return (
    <html>
      <head>
        <link rel="stylesheet" href="home.css" />
      </head>
      <body>
        <Sidebar actor={actor} />
        <main>
          <div className="two-up">
            <div className="card">
              <Welcome actor={actor} />
            </div>
            <div className="card">
              <CreateForm actor={actor} />
            </div>
          </div>
          <div className="two-up">
            <div className="card">
              <OrderedCollectionEntity headingLevel={2} collection={actor.inbox as AP.OrderedCollection} />
            </div>
            <div className="card">
              <OrderedCollectionEntity headingLevel={2} collection={actor.outbox as AP.OrderedCollection} />
            </div>
          </div>
          <div className="two-up">
            <div className="card">
              <CollectionEntity headingLevel={2} collection={actor.following as AP.Collection} />
            </div>
            <div className="card">
              <CollectionEntity headingLevel={2} collection={actor.followers as AP.Collection} />
            </div>
          </div>
          <textarea defaultValue={JSON.stringify(actor)}></textarea>
        </main>
      </body>
    </html>
  )
}