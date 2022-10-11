import { AP } from 'activitypub-core-types/src';
import React from 'react';

export function ActivityEntity({ activity }: { activity: AP.Activity }) {
  const {
    actor,
    target
  } = activity;

  console.log({
    activity,
  })

  let object = null;

  if ('object' in activity) {
    object = activity.object;
  }

  if (!actor) {
    return <>Not found.</>;
  }

  return (
    <div>
      <h1>
        {activity.type}
      </h1>
    </div>
  );
}
