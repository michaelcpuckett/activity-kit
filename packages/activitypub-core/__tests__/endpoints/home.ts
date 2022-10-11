import { mockDatabaseService } from '../DatabaseService/mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import { homeGetHandler } from '../../src/endpoints/home';
import { IncomingMessage, ServerResponse } from 'http';

describe('Endpoints', () => {
  describe('Home', () => {
    const actor1Url = `https://test.com/actor/123`;
    const actor1InboxUrl = `${actor1Url}/inbox`;
    const actor1OutboxUrl = `${actor1Url}/outbox`;
    const actor1FollowersUrl = `${actor1Url}/followers`;
    const actor1FollowingUrl = `${actor1Url}/following`;

    const actor1Result: AP.Person = {
      id: new URL(actor1Url),
      url: new URL(actor1Url),
      type: 'Person',
      inbox: new URL(actor1InboxUrl),
      outbox: new URL(actor1OutboxUrl),
      following: new URL(actor1FollowingUrl),
      followers: new URL(actor1FollowersUrl),
      streams: [],
    };

    const actor1Inbox: AP.OrderedCollection = {
      id: new URL(actor1InboxUrl),
      url: new URL(actor1InboxUrl),
      type: 'OrderedCollection',
      totalItems: 0,
      orderedItems: [],
    };

    const actor1Outbox: AP.OrderedCollection = {
      id: new URL(actor1OutboxUrl),
      url: new URL(actor1OutboxUrl),
      type: 'OrderedCollection',
      totalItems: 0,
      orderedItems: [],
    };
    const actor1Followers: AP.OrderedCollection = {
      id: new URL(actor1FollowersUrl),
      url: new URL(actor1FollowersUrl),
      type: 'OrderedCollection',
      totalItems: 0,
      orderedItems: [],
    };

    const actor1Following: AP.OrderedCollection = {
      id: new URL(actor1FollowingUrl),
      url: new URL(actor1FollowingUrl),
      type: 'OrderedCollection',
      totalItems: 0,
      orderedItems: [],
    };

    const databaseService = mockDatabaseService({
      getActorByToken: jest.fn(() => {
        return JSON.parse(JSON.stringify(actor1Result));
      }),
      db: {
        findOne: jest.fn(({ _id }) => {
          if (_id === actor1Url) {
            return JSON.parse(
              JSON.stringify({
                _id: actor1Url,
                ...JSON.parse(JSON.stringify(actor1Result)),
              }),
            );
          }
          if (_id === actor1InboxUrl) {
            return {
              id: actor1InboxUrl,
              ...JSON.parse(JSON.stringify(actor1Inbox)),
            };
          }
          if (_id === actor1OutboxUrl) {
            return {
              id: actor1OutboxUrl,
              ...JSON.parse(JSON.stringify(actor1Outbox)),
            };
          }
          if (_id === actor1FollowersUrl) {
            return {
              id: actor1FollowersUrl,
              ...JSON.parse(JSON.stringify(actor1Followers)),
            };
          }
          if (_id === actor1FollowingUrl) {
            return {
              id: actor1FollowingUrl,
              ...JSON.parse(JSON.stringify(actor1Following)),
            };
          }
          return null;
        }),
      } as unknown as Db,
    });

    const setHeader = jest.fn(() => { });
    const write = jest.fn(() => { });
    const end = jest.fn(() => { });

    it('works with text/html accept header', async () => {
      const request: Partial<IncomingMessage> = {
        url: actor1Url.toString().split('https://test.com')[1],
        headers: {
          accept: 'text/html',
          cookie: '__session=xyz',
        },
      };
      const response: Partial<ServerResponse> = {
        setHeader,
        write,
        end,
      };
      const data = await homeGetHandler(
        request as IncomingMessage,
        response as ServerResponse,
        void 0,
        databaseService,
      );
      expect(data.props).toStrictEqual(
        JSON.parse(
          JSON.stringify({
            actor: {
              ...actor1Result,
              inbox: actor1Inbox,
              outbox: actor1Outbox,
              following: actor1Following,
              followers: actor1Followers,
              streams: [],
            },
          }),
        ),
      );
    });
  });
});
