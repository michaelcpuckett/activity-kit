import { AP } from 'activitypub-core-types';
import React from 'react';
import { ActivityEntity } from './Activity';

export function OrderedCollectionEntity({ collection, headingLevel }: { collection: AP.OrderedCollection; headingLevel: number; }) {
  const {
    orderedItems: items
  } = collection;

  if (!Array.isArray(items)) {
    return <></>
  }

  return (
    <div>
      <span role="heading" aria-level={headingLevel}>
        {collection.name}
      </span>
      {Array.isArray(collection.orderedItems) ? collection.orderedItems.map(item => {
        if (item instanceof URL) {
          return <></>
        }
        for (const type of Object.values(AP.ActivityTypes)) {
          if (type === item.type) {
            return <ActivityEntity headingLevel={headingLevel + 1} activity={item} />
          }
        }
        return <li key={item.id.toString()}>
          {item.type}
        </li>
      }) : null}
    </div>
  );
}