import { OutboxPostHandler } from '../../src/outbox';
import { IncomingMessage, ServerResponse } from 'http';
import { Socket } from 'net';
import * as data from '../../__data__';

export const handleOutboxPost = async (activity, url) => {
  const broadcast = jest.fn(async () => {
    return true;
  });

  const saveEntity = jest.fn(async () => {
    return true;
  });

  const insertOrderedItem = jest.fn(async () => {
    return true;
  });

  const insertItem = jest.fn(async () => {
    return true;
  });

  const res = new ServerResponse(new IncomingMessage(new Socket()));
  const auth = {
    getUserIdByToken() {
      return '123';
    },
  };
  const db = {
    async findOne(collection, { _id, outbox }) {
      if (_id === data.aliceUrl) {
        return data.alice;
      }

      if (outbox === data.aliceOutboxUrl) {
        return data.alice;
      }

      if (_id === data.collection1Url) {
        return data.collection1;
      }

      if (_id === data.note1Url) {
        return data.note1;
      }

      return null;
    },
    async findEntityById(id: URL) {
      return this.findOne(null, { _id: id.toString() });
    },
    async queryById(id: URL) {
      return this.findOne(null, { _id: id.toString() });
    },
    async getActorByUserId() {
      return data.alice;
    },
    saveEntity,
    insertOrderedItem,
    insertItem,
  };
  const delivery = {
    broadcast,
  };

  const req = new IncomingMessage(new Socket());
  req[Symbol.asyncIterator] = async function*() {
    yield JSON.stringify(activity);
  };
  req.method = 'POST';
  req.url = new URL(url).pathname;

  const handler = new OutboxPostHandler(req, res, auth, db, delivery);
  await handler.init();

  return {
    req, res, auth, db, delivery,
    saveEntity, insertOrderedItem, insertItem, broadcast,
  };
};

describe('Endpoints', () => {
  describe('Actor Outbox', () => {
    it('works', () => {
      expect(handleOutboxPost).toBeTruthy();
    })
  });
});
