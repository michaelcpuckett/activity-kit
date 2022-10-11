import { RequestOptions } from 'http';
import { Db } from 'mongodb';
import { DatabaseService } from '../../src/DatabaseService';
import { findOne } from '../endpoints/box';

export function mockDatabaseService({
  getActorByToken,
  getPrivateKey,
  db,
  fetch,
  fetchResponder = function (url: string, config: RequestOptions) {
    return async function () {
      return null;
    };
  },
}: {
  getActorByToken?: Function;
  getPrivateKey?: Function;
  db?: Db;
  fetch?: Function;
  fetchResponder?: (url: string, config: RequestOptions) => unknown;
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
    jest.fn(async (url: string, config: RequestOptions) => ({
      json: fetchResponder(url, config),
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
