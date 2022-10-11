import { AP } from 'activitypub-core-types';
import React from 'react';

export function OrderedCollectionEntity({ collection }: { collection: AP.OrderedCollection }) {
  const {
    orderedItems: items
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