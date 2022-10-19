import { ACTIVITYSTREAMS_CONTEXT } from '../../../src/globals';
import { AP } from 'activitypub-core-types';
import * as data from '../../data';
import { inboxHandler } from '../box';

describe('Endpoints', () => {
  describe('Actor Inbox', () => {
    it('Accepts Activity Objects', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        to: [new URL(data.actor1Url), new URL(data.actor3Url)],
        type: 'Arrive',
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(0); // no delivery.

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with TO:collection', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Arrive',
        to: [new URL(data.actor1Url), new URL(data.collection1Url)],
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with CC:collection', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Arrive',
        to: new URL(data.actor1Url),
        cc: new URL(data.collection1Url),
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with audience:collection', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Arrive',
        to: new URL(data.actor1Url),
        audience: new URL(data.collection1Url),
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with known inReplyTo', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Read',
        to: [new URL(data.actor1Url), new URL(data.actor3Url)],
        actor: new URL(data.actor2Url),
        object: new URL('https://foreign-url.test.com/~123'),
        inReplyTo: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with known object', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Read',
        to: [new URL(data.actor1Url), new URL(data.actor3Url)],
        actor: new URL(data.actor2Url),
        object: new URL(data.note1Url),
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with known target', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Arrive',
        to: [new URL(data.actor1Url), new URL(data.actor3Url)],
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
        target: new URL(data.collection1Url),
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Forwards with known tag', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Arrive',
        to: [new URL(data.actor1Url), new URL(data.actor3Url)],
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
        tag: new URL(data.actor3Url),
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // delivery {to: actor3}

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts announce activity (increments shares)', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Announce = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Announce',
        to: new URL(data.actor1Url),
        actor: new URL(data.actor2Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into inbox, insert Share into Shares
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts like activity (increments likes)', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Like = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Like',
        to: new URL(data.actor1Url),
        actor: new URL(data.actor2Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into inbox, insert Like into Likes
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts Follow request from another Actor (follows back automatically)', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Follow = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Follow',
        actor: new URL(data.actor2Url),
        to: new URL(data.actor1Url),
        object: new URL(data.actor1Url),
      };

      const { updateOne, replaceOne, signAndSendToForeignActorInbox, end } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into inbox, insert follower, insert activity into outbox
      expect(replaceOne).toBeCalledTimes(2); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(1); // auto-generated response

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts accept activity', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Accept = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Accept',
        actor: new URL(data.actor2Url),
        to: new URL(data.actor1Url),
        object: new URL(data.originalFollowActivityId),
      };

      const { updateOne, replaceOne, end } = await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(3); // insert activity into inbox, insert follower, insert followee
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts JSON-LD', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity = {
        '@context': {
          as: new URL(ACTIVITYSTREAMS_CONTEXT),
        },
        '@id': new URL(activityId),
        '@type': ['as:Arrive'],
        'as:url': [
          {
            '@id': new URL(activityId),
          },
        ],
        'as:actor': [
          {
            '@id': new URL(data.actor2Url),
          },
        ],
        'as:to': [
          {
            '@id': new URL(data.actor1Url),
          },
          {
            '@id': new URL(data.actor3Url),
          },
        ],
        'as:location': [
          {
            '@type': 'as:Place',
            'as:name': 'Disney World',
          },
        ],
      };

      const { updateOne, replaceOne, end, signAndSendToForeignActorInbox } =
        await inboxHandler(activity);

      expect(updateOne).toBeCalledTimes(1); // insert activity into inbox
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(0); // no delivery.

      expect(end).toBeCalledTimes(1);
    });
  });
});
