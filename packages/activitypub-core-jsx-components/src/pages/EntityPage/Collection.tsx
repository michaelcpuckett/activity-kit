import { AP } from 'activitypub-core-types/src';
import React from 'react';


export function CollectionEntity({ collection }: { collection: AP.Collection }) {
  const {
    items
  } = collection;

  if (!Array.isArray(items)) {
    return <></>
  }

  return (
    <div>
      <h1>
        {collection.name}
      </h1>
    </div>
  );
}