import { AP } from 'activitypub-core-types';
import type { Plugin } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT, convertStringsToUrls, W3ID_SECURITY_CONTEXT } from 'activitypub-core-utilities';

export const foafPlugin = function(config: {
  newPerson?: JSON
}) {
  const foafPlugin: Plugin = {
    handleCreateUserActor(this: {
      activity: AP.Activity
    }): AP.Activity {
      if (!config.newPerson) {
        return this.activity;
      }

      if (!('object' in this.activity) || this.activity.object instanceof URL || Array.isArray(this.activity.object)) {
        return this.activity;
      }

      return {
        ...this.activity,
        '@context': [
          new URL(ACTIVITYSTREAMS_CONTEXT),
          new URL(W3ID_SECURITY_CONTEXT),
          { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
        ],
        object: {
          ...this.activity.object,
          ...convertStringsToUrls(JSON.parse(JSON.stringify(config.newPerson))),
        }
      };
    }
  }

  return foafPlugin;
}