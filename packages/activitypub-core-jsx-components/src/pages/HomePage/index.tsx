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
        <link rel="stylesheet" href="/home.css" />
      </head>
      <body>
        <div className="root">
          <Sidebar actor={actor} />
          <main>
            <div className="two-up">
              <div className="card">
                <Welcome actor={actor} headingLevel={1} />
              </div>
              <div className="card">
                <CreateForm headingLevel={2} actor={actor} />
              </div>
            </div>
            <textarea defaultValue={JSON.stringify(actor)}></textarea>
          </main>
        </div>
      </body>
    </html>
  )
}