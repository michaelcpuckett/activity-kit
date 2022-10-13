import { AP } from 'activitypub-core-types';
import React from 'react';


export function CollectionEntity({ collection, headingLevel }: { collection: AP.Collection; headingLevel: number; }) {
  const {
    items
  } = collection;

  if (!Array.isArray(items)) {
    return <></>
  }

  return (
    <div>
      <span role="heading" aria-level={headingLevel}>
        {collection.name}
      </span>
    </div>
  );
}