import { AP } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';
import React from 'react';
import { ActivityEntity } from './Activity';
import { ActorEntity } from './Actor';
import { LinkEntity } from './Link';
import { ObjectEntity } from './Object';


export function CollectionEntity({ collection, actor, headingLevel }: { collection: AP.Collection; actor: AP.Actor; headingLevel: number; }) {
  const {
    items
  } = collection;

  if (!Array.isArray(items)) {
    return <></>
  }

  return (
    <div className="card">
      <span role="heading" aria-level={headingLevel}>
        {collection.name}
      </span>

      {actor && collection.name === 'Following' ? <FollowForm headingLevel={headingLevel + 1} actor={actor} /> : null}

      {Array.isArray(collection.items) ? collection.items.map(item => {
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

function FollowForm({ actor, headingLevel }: { actor: AP.Actor; headingLevel: number; }) {
  return <div className="card">
    <span role="heading" aria-lavel={headingLevel}>
      Follow a Friend
    </span>
    <form id="followForm" noValidate action={getId(actor.outbox).toString()}>
      <input type="hidden" name="actor" value={getId(actor).toString()} />
      <label>
        <input type="text" name="object" />
      </label>
      <button type="submit">
        Follow
      </button>
    </form>
    <script type="module" src="/followForm.js"></script>
  </div>
}