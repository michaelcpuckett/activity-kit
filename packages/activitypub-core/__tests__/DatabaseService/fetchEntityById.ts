import { mockDatabaseService } from './mockDatabaseService';
import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT } from '../../src/globals';

describe('DatabaseService', () => {
  describe('fetchEntityById', () => {
    const actor1Url = 'https://foreign.test.com/456';
    const actor1Result: AP.Person = {
      "@context": new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL('https://foreign.test.com/456'),
      url: new URL('https://foreign.test.com/456'),
      type: 'Person',
      name: 'Michael',
      inbox: new URL('https://foreign.test.com/456/inbox'),
      outbox: new URL('https://foreign.test.com/456/inbox'),
    };

    const databaseService = mockDatabaseService({
      fetchResponder: function (request: Request) {
        return async function () {
          if (request.url === actor1Url) {
            return JSON.parse(JSON.stringify(actor1Result));
          }

          return null;
        };
      },
    });

    it('should fetch from remote host', async () => {
      const result = await databaseService.fetchEntityById(new URL(actor1Url));
      expect(result).toMatchObject(actor1Result);
    });
  });
});
