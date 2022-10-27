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
      console.log('handleCreateUserActor');
      console.log(config.newPerson);
      if (!config.newPerson) {
        return this.activity;
      }

      console.log(this.activity);
      console.log('^ the activity');

      if (!('object' in this.activity) || this.activity.object instanceof URL || Array.isArray(this.activity.object)) {
        return this.activity;
      }

      console.log({
        ...this.activity,
        '@context': [
          new URL(ACTIVITYSTREAMS_CONTEXT),
          new URL(W3ID_SECURITY_CONTEXT),
          { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
        ],
        object: {
          ...this.activity.object,
          ...convertStringsToUrls(config.newPerson as unknown as {[key: string]: unknown}),
        }
      })
      console.log('will return a value')

      return {
        ...this.activity,
        '@context': [
          new URL(ACTIVITYSTREAMS_CONTEXT),
          new URL(W3ID_SECURITY_CONTEXT),
          { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
        ],
        object: {
          ...this.activity.object,
          ...convertStringsToUrls(config.newPerson as unknown as {[key: string]: unknown}),
          '@context': [
            new URL(ACTIVITYSTREAMS_CONTEXT),
            { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
          ],
        }
      };
    }
  }

  return foafPlugin;
}