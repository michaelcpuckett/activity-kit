import { mockDbAdapter } from './mockDbAdapter';
import { AP } from 'activitypub-core-types';
import { ACTIVITYSTREAMS_CONTEXT } from 'activitypub-core-utilities';

describe('DbAdapter', () => {
  describe('fetchEntityById', () => {
    const actor1Url = 'https://foreign.test.com/456';
    const actor1Result: AP.Person = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL('https://foreign.test.com/456'),
      url: new URL('https://foreign.test.com/456'),
      type: 'Person',
      name: 'Michael',
      inbox: new URL('https://foreign.test.com/456/inbox'),
      outbox: new URL('https://foreign.test.com/456/inbox'),
    };

    const dbAdapter = mockDbAdapter({
      fetch: async function (url: string) {
        return {
          json: async () => {
            if (url === actor1Url) {
              return JSON.parse(JSON.stringify(actor1Result));
            }

            return null;
          },
        };
      },
    });

    it('should fetch from remote host', async () => {
      const result = await dbAdapter.fetchEntityById(new URL(actor1Url));
      expect(result).toMatchObject(actor1Result);
    });
  });
});
