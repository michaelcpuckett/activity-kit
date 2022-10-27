import { AP } from 'activitypub-core-types';
import type { Plugin } from 'activitypub-core-types';
import { OutboxPostHandler } from 'activitypub-core-endpoints/lib/outbox';
import { ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT } from 'activitypub-core-utilities';

export const foafPlugin = function(config: {
  newPerson: JSON
}) {
  return new (class FoafPlugin implements Plugin {
    handleCreateUserActor(this: OutboxPostHandler) {
    }
    createUserActor(this: {
      activity: AP.Create
    }) {
      return {
        ...this.activity,
        '@context': [
          ACTIVITYSTREAMS_CONTEXT,
          W3ID_SECURITY_CONTEXT,
          { "foaf": "http://xmlns.com/foaf/0.1/" }
        ],
        object: {
          ...this.activity.object,
          ...config.newPerson,
        }
      };
    }
  })();
}