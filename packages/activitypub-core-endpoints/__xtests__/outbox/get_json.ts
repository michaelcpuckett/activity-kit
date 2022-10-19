jest.mock('../../../src/utilities/streamToString', () => {
  return {
    streamToString: function streamToString(req) {
      return req.body;
    },
  };
});

import { mockDatabaseService } from '../../DatabaseService/mockDatabaseService';
import { Db } from 'mongodb';
import { outboxHandler } from '../../../src/endpoints/outbox';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
  ACTIVITYSTREAMS_CONTEXT,
  CONTENT_TYPE_HEADER,
} from '../../../src/globals';
import * as data from '../../data';
import { IncomingMessage, ServerResponse } from 'http';

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('GET application/json', async () => {
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

      const setHeader = jest.fn(() => {});
      const write = jest.fn(() => {});
      const end = jest.fn(() => {});

      const req: IncomingMessage = {
        url: data.actor1OutboxUrl.toString().split('https://test.com')[1],
        headers: {
          accept: ACTIVITYSTREAMS_CONTENT_TYPE,
        },
      };
      const res: ServerResponse = {
        setHeader,
        write,
        end,
      };
      await outboxHandler(req, res, databaseService);
      expect(setHeader).toBeCalledWith(
        CONTENT_TYPE_HEADER,
        ACTIVITYSTREAMS_CONTENT_TYPE,
      );
      expect(write).toBeCalledWith(
        JSON.stringify({
          '@context': ACTIVITYSTREAMS_CONTEXT,
          ...data.actor1Outbox,
        }),
      );
      expect(end).toBeCalledTimes(1);
    });
  });
});
