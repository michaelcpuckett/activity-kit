import { ACTIVITYSTREAMS_CONTEXT } from '../../../src/globals';
import { AP } from 'activitypub-core-types';
import * as data from '../../data';
import { sharedInboxPostHandler } from '../box';

describe('Endpoints', () => {
  describe('Actor Inbox', () => {
    it('Accepts Activity Objects', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Activity = {
        '@context': ACTIVITYSTREAMS_CONTEXT,
        id: new URL(activityId),
        url: new URL(activityId),
        to: [new URL(data.actor4Url), new URL(data.actor5Url)],
        type: 'Arrive',
        actor: new URL(data.actor2Url),
        location: {
          type: 'Place',
          name: 'Disney World',
        },
      };

      const { updateOne, replaceOne, end } = await sharedInboxPostHandler(
        activity,
      );

      expect(updateOne).toBeCalledTimes(2); // insert activity into 2 inboxes
      expect(replaceOne).toBeCalledTimes(1); // activity

      expect(end).toBeCalledTimes(1);
    });

    it('Accepts announce activity (increments shares)', async () => {
      const activityId = 'https://test.com/activity/~123';
      const activity: AP.Announce = {
        '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
        id: new URL(activityId),
        url: new URL(activityId),
        type: 'Announce',
        to: [new URL(data.actor4Url), new URL(data.actor5Url)],
        actor: new URL(data.actor2Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await sharedInboxPostHandler(
        activity,
      );

      expect(updateOne).toBeCalledTimes(3); // insert activity into both inboxes, insert Share into Shares
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
        to: [new URL(data.actor4Url), new URL(data.actor5Url)],
        actor: new URL(data.actor2Url),
        object: new URL(data.note2Url),
      };

      const { updateOne, replaceOne, end } = await sharedInboxPostHandler(
        activity,
      );

      expect(updateOne).toBeCalledTimes(3); // insert activity into both inboxes, insert Like into Likes
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
        to: [new URL(data.actor4Url), new URL(data.actor5Url)],
        object: new URL(data.actor1Url),
      };

      const { updateOne, replaceOne, signAndSendToForeignActorInbox, end } =
        await sharedInboxPostHandler(activity);

      expect(updateOne).toBeCalledTimes(4); // insert activity into both inboxes, insert follower, insert activity into outbox
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
        to: [new URL(data.actor4Url), new URL(data.actor5Url)],
        object: new URL(data.originalFollowActivityId),
      };

      const { updateOne, replaceOne, end } = await sharedInboxPostHandler(
        activity,
      );

      expect(updateOne).toBeCalledTimes(4); // insert activity into both inboxes, insert follower, insert followee
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
            '@id': new URL(data.actor4Url),
          },
          {
            '@id': new URL(data.actor5Url),
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
        await sharedInboxPostHandler(activity);

      expect(updateOne).toBeCalledTimes(2); // insert activity into both inboxes
      expect(replaceOne).toBeCalledTimes(1); // activity
      expect(signAndSendToForeignActorInbox).toBeCalledTimes(0); // no delivery.

      expect(end).toBeCalledTimes(1);
    });
  });
});
