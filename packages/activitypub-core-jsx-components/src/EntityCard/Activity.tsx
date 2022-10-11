import { AP } from 'activitypub-core-types';
import { EntityLink } from '../EntityLink';
import { EntityMeta } from '../EntityMeta';
import { NoteCard } from './Note';

export function ActivityCard({ activity }: { activity: AP.Activity }) {
  const {
    actor,
    target
  } = activity;

  const object = 'object' in activity ? activity.object : null;

  if (!actor || typeof actor !== 'object' || !('id' in actor) || !actor.id) {
    return <>Not found.</>;
  }

  return (
    <div>
      <h2>
        <EntityLink entity={activity}>
          {activity.type}
        </EntityLink>
      </h2>
      <dl>
        <EntityMeta entity={actor as AP.Entity}>
          Actor
        </EntityMeta>
        <EntityMeta entity={object as AP.Entity}>
          Object
        </EntityMeta>
        <EntityMeta entity={target as AP.Entity}>
          Target
        </EntityMeta>
      </dl>
      {object && !(object instanceof URL) && !Array.isArray(object) && object.type === AP.ExtendedObjectTypes.NOTE ? <NoteCard note={object} /> : null}
    </div>
  );
}



