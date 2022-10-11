import { ACTIVITYSTREAMS_CONTEXT } from '../../../src/globals';
import { AP } from 'activitypub-core-types';
import * as data from '../../data';
import { outboxHandler } from '../box';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('Accepts Activity Objects (outbox:accepts-activities)', async () => {
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        type: 'Arrive',
        actor: new URL(data.actor1Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: create', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Create',
        actor: new URL(data.actor1Url),
        object: {
          type: 'Note',
          content: 'Hello world',
        },
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(4); // activity, created object, object likes, object shares

      expect(end).toBeCalledTimes(1);
    });

    it('Rejects POST: create and no object', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Create',
      };

      const { updateOne, replaceOne, write, end } = await outboxHandler(
        activity,
      );

      expect(write).toBeCalledWith('Bad request');

      expect(updateOne).toBeCalledTimes(0); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(0); // activity, created object, object likes, object shares

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts non-Activity Objects, and converts to Create Activities (`outbox:accepts-non-activity-objects`) *MUST*', async () => {
      const object: AP.Note = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Note',
        summary: 'Hello world',
      };

      const { updateOne, replaceOne, end } = await outboxHandler(object);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(4); // activity, created object, object likes, object shares

      expect(end).toBeCalledTimes(1);
    });

    it('Server does not trust client submitted content (outbox:not-trust-submitted) SHOULD', async () => {
      const activity: AP.Read = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: AP.ActivityTypes.READ,
        actor: new URL(data.actor2Url),
        object: {
          id: new URL('https://example.org/~alice/note/23'),
          type: 'Note',
          attributedTo: new URL(data.actor2Url),
          content: "I'm a goat",
        },
      };

      const { updateOne, replaceOne, write, end } = await outboxHandler(
        activity,
      );

      expect(write).toBeCalledWith('Bad request');

      expect(updateOne).toBeCalledTimes(0); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(0); // activity, created object, object likes, object shares

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: add', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Add',
        actor: new URL(data.actor1Url),
        target: new URL(data.collection1Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into outbox, insert object into collection
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Rejects POST: add with remote target', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Add',
        actor: new URL(data.actor1Url),
        target: new URL(data.remoteCollection1Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, write, end } = await outboxHandler(
        activity,
      );

      expect(write).toBeCalledWith('Bad request');
      expect(updateOne).toBeCalledTimes(0); // insert activity into outbox, insert object into collection
      expect(replaceOne).toBeCalledTimes(0); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: announce', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Announce',
        actor: new URL(data.actor1Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into outbox, insert object into shares collection. insert object into shared collection
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: delete', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Delete',
        actor: new URL(data.actor1Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(2); // activity, tombstone

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: like', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Like',
        actor: new URL(data.actor1Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into outbox, insert object into likes collection. insert object into liked collection
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: remove', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Remove',
        actor: new URL(data.actor1Url),
        target: new URL(data.collection2Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into outbox, remove object from collection
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Rejects POST: remove with remote target', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Remove',
        actor: new URL(data.actor1Url),
        target: new URL(data.remoteCollection1Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, write, end } = await outboxHandler(
        activity,
      );

      expect(write).toBeCalledWith('Bad request');
      expect(updateOne).toBeCalledTimes(0); // insert activity into outbox, insert object into collection
      expect(replaceOne).toBeCalledTimes(0); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts POST: update', async () => {
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        type: 'Update',
        actor: new URL(data.actor1Url),
        object: {
          ...data.note1,
          content: 'Goodbye!',
        },
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(2); // activity, updated object

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts JSON-LD', async () => {
      const activity = {
        '@context': {
          as: ACTIVITYSTREAMS_CONTEXT,
        },
        '@type': 'as:Arrive',
        'as:actor': [
          {
            '@id': new URL(data.actor1Url),
          },
        ],
        'as:location': {
          '@type': 'Place',
          'as:name': 'Disney World',
        },
      };

      const { updateOne, replaceOne, end } = await outboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into outbox
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });
  });
});
