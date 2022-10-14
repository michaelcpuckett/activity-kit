import { AP } from 'activitypub-core-types';
import React from 'react';
import { ObjectEntity } from './Object';

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
    <div className="card">
      <span role="heading" aria-level={headingLevel}>
        {activity.type}
      </span>
      {'object' in activity && activity.object ? <ObjectEntity object={activity.object as AP.ExtendedObject} headingLevel={headingLevel + 1} /> : null}
    </div>
  );
}