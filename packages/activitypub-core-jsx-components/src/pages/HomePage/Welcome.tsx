import { AP } from 'activitypub-core-types/src';
import React from 'react';

export function Welcome({ actor }: { actor: AP.Actor }) {
  return <>
    <h1>Welcome, @{actor.preferredUsername}</h1>
  </>
}
