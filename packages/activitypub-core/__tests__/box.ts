jest.mock('../../src/utilities/streamToString', () => {
  return {
    streamToString: function streamToString(req: IncomingMessage & {
      body: string;
    }) {
      return req.body;
    },
  };
});

import { Socket } from 'net';
import type { Db } from 'mongodb';
import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTENT_TYPE } from '../../src/globals';
import { mockDatabaseService } from '../../../activitypub-core-mongodb/DatabaseService/mockDatabaseService';
import * as data from '../data';
import { DeliveryService } from '../../src/DeliveryService';
import { outboxHandler as outbox } from '../../src/outbox';
import { inboxHandler as inbox } from '../../src/inbox';
import { sharedInboxPostHandler as sharedInbox } from '../../src/sharedInbox';
import { IncomingMessage, ServerResponse } from 'http';

export const findOne = jest.fn(({ _id, outbox, inbox }) => {
  if (_id === data.actor1Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1Url,
        ...JSON.parse(JSON.stringify(data.actor1Result)),
      }),
    );
  }
  if (_id === data.actor1FollowingUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1FollowingUrl,
        ...JSON.parse(JSON.stringify(data.actor1Following)),
      }),
    );
  }
  if (_id === data.actor1FollowersUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1FollowersUrl,
        ...JSON.parse(JSON.stringify(data.actor1Followers)),
      }),
    );
  }
  if (_id === data.actor2FollowingUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor2FollowingUrl,
        ...JSON.parse(JSON.stringify(data.actor2Following)),
      }),
    );
  }
  if (_id === data.actor2FollowersUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor2FollowersUrl,
        ...JSON.parse(JSON.stringify(data.actor2Followers)),
      }),
    );
  }
  if (_id === data.actor1InboxUrl) {
    return {
      _id: data.actor1InboxUrl,
      ...JSON.parse(JSON.stringify(data.actor1Inbox)),
    };
  }
  if (_id === data.actor1OutboxUrl) {
    return {
      _id: data.actor1OutboxUrl,
      ...JSON.parse(JSON.stringify(data.actor1Outbox)),
    };
  }
  if (_id === data.actor2Url) {
    return {
      _id: data.actor2Url,
      ...JSON.parse(JSON.stringify(data.actor2Result)),
    };
  }
  if (_id === data.actor2InboxUrl) {
    return {
      _id: data.actor2InboxUrl,
      ...JSON.parse(JSON.stringify(data.actor2Inbox)),
    };
  }
  if (_id === data.actor2OutboxUrl) {
    return {
      _id: data.actor2OutboxUrl,
      ...JSON.parse(JSON.stringify(data.actor2Outbox)),
    };
  }
  if (_id === data.actor3Url) {
    return {
      _id: data.actor3Url,
      ...JSON.parse(JSON.stringify(data.actor3Result)),
    };
  }
  if (_id === data.actor3InboxUrl) {
    return {
      _id: data.actor3InboxUrl,
      ...JSON.parse(JSON.stringify(data.actor3Inbox)),
    };
  }
  if (_id === data.actor3OutboxUrl) {
    return {
      _id: data.actor3OutboxUrl,
      ...JSON.parse(JSON.stringify(data.actor3Outbox)),
    };
  }
  if (outbox === data.actor1OutboxUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1Url,
        ...JSON.parse(JSON.stringify(data.actor1Result)),
      }),
    );
  }
  if (outbox === data.actor2OutboxUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor2Url,
        ...JSON.parse(JSON.stringify(data.actor2Result)),
      }),
    );
  }
  if (_id === data.actor4Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor4Url,
        ...JSON.parse(JSON.stringify(data.actor4Result)),
      }),
    );
  }
  if (_id === data.actor5Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor5Url,
        ...JSON.parse(JSON.stringify(data.actor5Result)),
      }),
    );
  }
  if (inbox === data.actor1InboxUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1InboxUrl,
        ...JSON.parse(JSON.stringify(data.actor1Result)),
      }),
    );
  }
  if (inbox === data.actor2InboxUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor2InboxUrl,
        ...JSON.parse(JSON.stringify(data.actor2Result)),
      }),
    );
  }
  if (_id === data.actor1SharedUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1SharedUrl,
        ...JSON.parse(JSON.stringify(data.actor1Shared)),
      }),
    );
  }
  if (_id === data.actor1LikedUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.actor1LikedUrl,
        ...JSON.parse(JSON.stringify(data.actor1Liked)),
      }),
    );
  }
  if (_id === data.collection1Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.collection1Url,
        ...JSON.parse(JSON.stringify(data.collection1)),
      }),
    );
  }
  if (_id === data.collection2Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.collection2Url,
        ...JSON.parse(JSON.stringify(data.collection2)),
      }),
    );
  }
  if (_id === data.note1Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.note1Url,
        ...JSON.parse(JSON.stringify(data.note1)),
      }),
    );
  }
  if (_id === data.note2Url) {
    return JSON.parse(
      JSON.stringify({
        _id: data.note2Url,
        ...JSON.parse(JSON.stringify(data.note2)),
      }),
    );
  }
  if (_id === data.note2LikesUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.note2LikesUrl,
        ...JSON.parse(JSON.stringify(data.note2Likes)),
      }),
    );
  }
  if (_id === data.note2SharesUrl) {
    return JSON.parse(
      JSON.stringify({
        _id: data.note2SharesUrl,
        ...JSON.parse(JSON.stringify(data.note2Shares)),
      }),
    );
  }
  if (_id === data.originalFollowActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalFollowActivityId,
        ...JSON.parse(JSON.stringify(data.originalFollowActivity)),
      }),
    );
  }
  if (_id === data.originalAddActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalAddActivityId,
        ...JSON.parse(JSON.stringify(data.originalAddActivity)),
      }),
    );
  }
  if (_id === data.originalRemoveActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalRemoveActivityId,
        ...JSON.parse(JSON.stringify(data.originalRemoveActivity)),
      }),
    );
  }
  if (_id === data.originalLikeActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalLikeActivityId,
        ...JSON.parse(JSON.stringify(data.originalLikeActivity)),
      }),
    );
  }
  if (_id === data.originalAnnounceActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalAnnounceActivityId,
        ...JSON.parse(JSON.stringify(data.originalAnnounceActivity)),
      }),
    );
  }
  if (_id === data.originalCreateActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalCreateActivityId,
        ...JSON.parse(JSON.stringify(data.originalCreateActivity)),
      }),
    );
  }
  if (_id === data.originalDeleteActivityId) {
    return JSON.parse(
      JSON.stringify({
        _id: data.originalDeleteActivityId,
        ...JSON.parse(JSON.stringify(data.originalDeleteActivity)),
      }),
    );
  }
  return null;
});

const handleBox = async (
  url: string,
  handler: Function,
  activity?: AP.Activity,
  options?: { [key: string]: unknown },
) => {
  const replaceOne = jest.fn(async (object) => {
    return true;
  });

  const updateOne = jest.fn(async (object) => {
    return true;
  });

  const fetch = jest.fn(async () => {
    return true;
  });

  const signAndSendToForeignActorInbox = jest.fn(async () => {
    return true;
  });

  const databaseService = mockDatabaseService({
    fetch,
    ...(options ?? {}),
    db: {
      replaceOne,
      updateOne,
      findOne,
    } as unknown as Db,
  });

  class ExtendedDeliveryService extends DeliveryService {
    public override signAndSendToForeignActorInbox =
      signAndSendToForeignActorInbox;
  }

  const deliveryService = new ExtendedDeliveryService(databaseService);

  const setHeader = jest.fn(() => { });
  const write = jest.fn(() => { });
  const end = jest.fn(() => { });

  const req: Partial<IncomingMessage> = new IncomingMessage(new Socket());

  req.method = 'POST';
  req.url = url;
  req.headers = {
    accept: ACTIVITYSTREAMS_CONTENT_TYPE,
  };
  req.body = JSON.stringify(activity);

  const res: Partial<ServerResponse> = {
    setHeader: setHeader as unknown as typeof ServerResponse.prototype.setHeader,
    write: write as unknown as typeof ServerResponse.prototype.write,
    end: end as unknown as typeof ServerResponse.prototype.end,
  };

  if (handler) {
    await handler(
      req as IncomingMessage,
      res as ServerResponse,
      databaseService,
      deliveryService,
    );
  }

  return {
    fetch,
    signAndSendToForeignActorInbox,
    replaceOne,
    updateOne,
    setHeader,
    write,
    end,
  };
};

export const inboxHandler = async (
  activity: AP.Activity,
  options?: { [key: string]: unknown },
) => {
  return await handleBox(
    data.actor1InboxUrl.toString().split('https://test.com')[1],
    inbox,
    activity,
    options,
  );
};

export const outboxHandler = async (
  activity: AP.Activity,
  options?: { [key: string]: unknown },
) => {
  return await handleBox(
    data.actor1OutboxUrl.toString().split('https://test.com')[1],
    outbox,
    activity,
    options,
  );
};

export const sharedInboxPostHandler = async (
  activity: AP.Activity,
  options?: { [key: string]: unknown },
) => {
  return await handleBox(
    data.actor4Result.endpoints.sharedInbox
      .toString()
      .split('https://test.com')[1],
    sharedInbox,
    activity,
    options,
  );
};

describe('post', () => {
  it('works', () => {
    expect(outboxHandler).toBeTruthy();
    expect(inboxHandler).toBeTruthy();
    expect(sharedInboxPostHandler).toBeTruthy();
  });
});
