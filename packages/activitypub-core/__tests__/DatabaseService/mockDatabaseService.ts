import { Db } from 'mongodb';
import { DatabaseService } from '../../src/DatabaseService';
import { findOne } from '../endpoints/box';

export function mockDatabaseService({
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
    collection: jest.fn(
      () =>
        db ?? {
          findOne,
        },
    ),
  } as unknown as Db;

  const fetchMock =
    fetch ??
    jest.fn(async (request: Request) => ({
      json: fetchResponder(request),
    }));

  let ExtendedDatabaseService = class extends DatabaseService { };

  if (getActorByToken) {
    const ExtendedDatabaseService2 = class extends ExtendedDatabaseService {
      public override getActorByToken = getActorByToken;
    };

    ExtendedDatabaseService = ExtendedDatabaseService2;
  }

  if (getPrivateKey) {
    const ExtendedDatabase2 = class extends ExtendedDatabaseService {
      public override getPrivateKey = getPrivateKey;
    };

    ExtendedDatabaseService = ExtendedDatabase2;
  }

  return new ExtendedDatabaseService(mockDbInstance, fetchMock);
}

describe('mockDatabaseService', () => {
  it('works', () => {
    expect(mockDatabaseService).toBeTruthy();
  });
});
