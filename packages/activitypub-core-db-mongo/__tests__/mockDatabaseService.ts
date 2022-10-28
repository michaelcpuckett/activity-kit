import { Db } from 'mongodb';
import { MongoDatabase } from '../src';

export function mockDbAdapter({
  getActorByToken,
  getPrivateKey,
  db,
  fetch,
  fetchResponder = function (request: Request) {
    return async function () {
      return null;
    };
  },
}: {
  getActorByToken?: Function;
  getPrivateKey?: Function;
  db?: Db;
  fetch?: Function;
  fetchResponder?: (request: Request) => unknown;
}) {
  const mockDbInstance = {
    collection: jest.fn(() => db ?? {}),
  } as unknown as Db;

  const fetchMock =
    fetch ??
    jest.fn(async (request: Request) => ({
      json: fetchResponder(request),
    }));

  let ExtendedDatabase = class extends MongoDatabase {};

  if (getActorByToken) {
    const ExtendedDatabase2 = class extends ExtendedDatabase {
      public override getActorByToken = getActorByToken;
    };

    ExtendedDatabase = ExtendedDatabase2;
  }

  if (getPrivateKey) {
    const ExtendedDatabase2 = class extends ExtendedDatabase {
      public override getPrivateKey = getPrivateKey;
    };

    ExtendedDatabase = ExtendedDatabase2;
  }

  return new ExtendedDatabase(mockDbInstance, fetchMock);
}

describe('mockDbAdapter', () => {
  it('works', () => {
    expect(mockDbAdapter).toBeTruthy();
  });
});
