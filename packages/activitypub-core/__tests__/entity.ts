import { mockDatabaseService } from '../DatabaseService/mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { Db } from 'mongodb';
import { entityGetHandler } from '../../src/endpoints/entity';
import { IncomingMessage, ServerResponse } from 'http';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACTIVITYSTREAMS_CONTEXT,
  CONTENT_TYPE_HEADER,
  W3ID_SECURITY_CONTEXT,
} from '../../src/globals';

describe('Endpoints', () => {
  describe('Entity', () => {
    const actor1Url = `https://test.com/actor/123`;
    const actor1InboxUrl = `${actor1Url}/inbox`;
    const actor1OutboxUrl = `${actor1Url}/outbox`;

    const actor1Result: AP.Person = {
      id: new URL(actor1Url),
      url: new URL(actor1Url),
      type: 'Person',
      inbox: new URL(actor1InboxUrl),
      outbox: new URL(actor1OutboxUrl),
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

    const databaseService = mockDatabaseService({
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
          return null;
        }),
      } as unknown as Db,
    });

    const setHeader = jest.fn(() => { });
    const write = jest.fn(() => { });
    const end = jest.fn(() => { });

    it('works with accept application/json', async () => {
      const request: Partial<IncomingMessage> = {
        url: actor1Url.toString().split('https://test.com')[1],
        headers: {
          accept: ACTIVITYSTREAMS_CONTENT_TYPE,
        },
      };
      const response: Partial<ServerResponse> = {
        setHeader,
        write,
        end,
      };
      const data = await entityGetHandler(request as IncomingMessage, response as ServerResponse, databaseService);
      expect(setHeader).toBeCalledWith(
        CONTENT_TYPE_HEADER,
        ACTIVITYSTREAMS_CONTENT_TYPE,
      );
      expect(write).toBeCalledWith(
        JSON.stringify({
          '@context': [ACTIVITYSTREAMS_CONTEXT, W3ID_SECURITY_CONTEXT],
          ...actor1Result,
          inbox: actor1Inbox,
          outbox: actor1Outbox,
        }),
      );
      expect(end).toBeCalledTimes(1);
    });

    it('works with text/html accept header', async () => {
      const request: Partial<IncomingMessage> = {
        url: actor1Url.toString().split('https://test.com')[1],
        headers: {
          accept: 'text/html',
        },
      };
      const response: Partial<ServerResponse> = {
        setHeader,
        write,
        end,
      };
      const data = await entityGetHandler(request as IncomingMessage, response as ServerResponse, databaseService);
      expect(data.props).toStrictEqual({
        entity: JSON.parse(
          JSON.stringify({
            ...actor1Result,
            inbox: actor1Inbox,
            outbox: actor1Outbox,
          }),
        ),
      });
    });
  });
});
