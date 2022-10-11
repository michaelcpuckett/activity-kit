import { PUBLIC_ACTOR } from 'activitypub-core/src/globals';
import { AP } from 'activitypub-core-types';
import { ActorCard } from './Actor';
import { ActivityCard } from './Activity';
import { NoteCard } from './Note';

export function EntityCard({ entity, streams, filter, actor, handleOutboxSubmit }: { entity: URL | AP.Entity, filter?: string; actor?: AP.Actor; handleOutboxSubmit?: Function; streams?: AP.EitherCollection[]; }) {
  if (entity instanceof URL) {
    return <>Not found.</>;
  }

  return <li className="card" key={entity.id?.toString() ?? ''}>
    <Entity entity={entity}></Entity>
  </li>;
}


function Entity({ entity }: { entity: AP.Entity }) {
  for (const type of Object.values(AP.ActivityTypes)) {
    if (entity.type === type) {
      return <ActivityCard activity={entity as AP.Activity}></ActivityCard>;
    }
  }

  for (const type of Object.values(AP.ActorTypes)) {
    if (entity.type === type) {
      return <ActorCard actor={entity as AP.Actor}></ActorCard>
    }
  }

  if (entity.type === AP.ExtendedObjectTypes.NOTE) {
    return <NoteCard note={entity as AP.Note}></NoteCard>
  }
  /*
  
    for (const type of Object.values(AP.ExtendedObjectTypes)) {
      if (entity.type === type) {
        return <ObjectEntity object={entity as AP.ExtendedObject}></ObjectEntity>
      }
    }
  
    for (const type of Object.values(AP.LinkTypes)) {
      if (entity.type === type) {
        return <LinkEntity link={entity as AP.Link}></LinkEntity>
      }
    }
  */
  return <>
    TODO.
  </>;
}