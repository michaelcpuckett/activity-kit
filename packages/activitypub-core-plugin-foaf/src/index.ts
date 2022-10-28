import { AP } from 'activitypub-core-types';
import type { Plugin } from 'activitypub-core-types';

export const FoafPlugin = function(config?: {}) {
  const foafPlugin: Plugin = {
    handleCreateUserActor(this: {
      activity: AP.Activity
    }): AP.Activity {
      return this.activity; // TODO add context, props
    }
  }

  return foafPlugin;
}