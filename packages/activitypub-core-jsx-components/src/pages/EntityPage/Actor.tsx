import { AP } from 'activitypub-core-types';
import React from 'react';

export function ActorEntity({ actor, headingLevel }: { actor: AP.Actor; headingLevel: number; }) {
  return (
    <div>
      <span role="heading" aria-level={headingLevel}>
        @{actor.preferredUsername ?? actor.name}
      </span>
    </div>
  );
}