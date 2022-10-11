jest.mock('../../../src/utilities/streamToString', () => {
  return {
    streamToString: function streamToString(req) {
      return req.body;
    },
  };
});

import * as data from '../../data';
import { mockDatabaseService } from '../../DatabaseService/mockDatabaseService';
import { Db } from 'mongodb';
import { outboxHandler } from '../../../src/endpoints/outbox';
import { IncomingMessage, ServerResponse } from 'http';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('GET text/html', async () => {
      const replaceOne = jest.fn(async (object) => {
        return true;
      });

      const updateOne = jest.fn(async (object) => {
        return true;
      });

      const databaseService = mockDatabaseService({
        db: {
          replaceOne,
          updateOne,
          findOne: jest.fn(({ _id, outbox }) => {
            if (_id === data.actor1Url) {
              return JSON.parse(
                JSON.stringify({
                  _id: data.actor1Url,
                  ...JSON.parse(JSON.stringify(data.actor1Result)),
                }),
              );
            }
            if (_id === data.actor1InboxUrl) {
              return {
                id: data.actor1InboxUrl,
                ...JSON.parse(JSON.stringify(data.actor1Inbox)),
              };
            }
            if (_id === data.actor1OutboxUrl) {
              return {
                id: data.actor1OutboxUrl,
                ...JSON.parse(JSON.stringify(data.actor1Outbox)),
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
            return null;
          }),
        } as unknown as Db,
      });

      const setHeader = jest.fn(() => { });
      const write = jest.fn(() => { });
      const end = jest.fn(() => { });

      const req: IncomingMessage = {
        url: data.actor1OutboxUrl.toString().split('https://test.com')[1],
        headers: {
          accept: 'text/html',
        },
      };
      const res: ServerResponse = {
        setHeader,
        write,
        end,
      };
      const result = await outboxHandler(req, res, databaseService);
      expect(result.props).toStrictEqual({
        entity: JSON.parse(JSON.stringify(data.actor1Outbox)),
      });
    });
  });
});
