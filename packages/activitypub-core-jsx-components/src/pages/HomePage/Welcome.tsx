import { AP } from 'activitypub-core-types';
import React from 'react';

export function Welcome({ actor, headingLevel }: { actor: AP.Actor; headingLevel: number; }) {
  return <>
    <span role="heading" aria-level={headingLevel}>
      Welcome, @{actor.preferredUsername}
    </span>
  </>
}
