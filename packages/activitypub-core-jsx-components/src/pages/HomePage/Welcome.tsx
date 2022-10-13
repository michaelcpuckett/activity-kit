import { AP } from 'activitypub-core-types';
import React from 'react';

export function Welcome({ actor }: { actor: AP.Actor }) {
  return <>
    <span role="heading" aria-level={1}>
      Welcome, @{actor.preferredUsername}
    </span>
  </>
}
