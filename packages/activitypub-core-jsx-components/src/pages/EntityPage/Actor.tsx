import { AP } from 'activitypub-core-types/src';
import React from 'react';

export function ActorEntity({ actor }: { actor: AP.Actor }) {
  return (
    <div>
      <h2>
        @{actor.preferredUsername ?? actor.name}
      </h2>
    </div>
  );
}