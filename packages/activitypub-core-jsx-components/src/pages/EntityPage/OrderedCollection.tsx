import { AP } from 'activitypub-core-types';
import React from 'react';
import { ActivityEntity } from './Activity';
import { ActorEntity } from './Actor';
import { LinkEntity } from './Link';
import { ObjectEntity } from './Object';

export function OrderedCollectionEntity({ collection, headingLevel }: { collection: AP.OrderedCollection; headingLevel: number; }) {
  const {
    orderedItems: items
  } = collection;

  if (!Array.isArray(items)) {
    return <></>
  }

  return (
    <div className="card">
      <span role="heading" aria-level={headingLevel}>
        {collection.name}
      </span>
      {Array.isArray(collection.orderedItems) ? collection.orderedItems.map(item => {
        if (item instanceof URL) {
          return <></>
        }
        for (const type of Object.values(AP.ActivityTypes)) {
          if (item.type === type) {
            return <ActivityEntity headingLevel={headingLevel + 1} activity={item as AP.Activity}></ActivityEntity>;
          }
        }

        for (const type of Object.values(AP.ActorTypes)) {
          if (item.type === type) {
            return <ActorEntity headingLevel={headingLevel + 1} actor={item as AP.Actor}></ActorEntity>
          }
        }

        for (const type of Object.values(AP.ExtendedObjectTypes)) {
          if (item.type === type) {
            return <ObjectEntity headingLevel={headingLevel + 1} object={item as AP.ExtendedObject}></ObjectEntity>
          }
        }

        for (const type of Object.values(AP.LinkTypes)) {
          if (item.type === type) {
            return <LinkEntity link={item as AP.Link}></LinkEntity>
          }
        }

        return <li key={item.id.toString()}>
          {item.type}
        </li>
      }) : null}
    </div>
  );
}