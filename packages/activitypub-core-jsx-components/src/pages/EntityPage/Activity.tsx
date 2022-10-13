import { AP } from 'activitypub-core-types';
import React from 'react';
import { NoteEntity } from './Note';

export function ActivityEntity({ activity, headingLevel }: { activity: AP.Activity, headingLevel: number }) {
  const {
    actor,
    target
  } = activity;

  let object = null;

  if ('object' in activity) {
    object = activity.object;
  }

  if (!actor) {
    return <>Not found.</>;
  }

  return (
    <div>
      <span role="heading" aria-level={headingLevel}>
        {activity.type}
      </span>
      {object && object.type === 'Note' ? <NoteEntity headingLevel={headingLevel + 1} note={object} /> : null}
    </div>
  );
}
