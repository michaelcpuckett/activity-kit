import 'jasmine';
import { AP } from 'activitypub-core-types';
import { handleCreate } from '../../../src/outbox/sideEffects/create';
import { createActivity } from '../../../test_data';
import { getId } from 'activitypub-core-utilities';

describe('Outbox', () => {
  describe('Create Side Effect', () => {
    it('Handles Create Activity', async () => {
      const saveEntityArguments: Array<URL|null> = [];

      await (handleCreate as unknown as (activity: AP.Create) => Promise<void>).call({
        adapters: {
          db: {
            async saveEntity(entity: AP.Entity) {
              saveEntityArguments.push(getId(entity));
            }
          }
        }
      }, createActivity);
      
      const [objectId] = saveEntityArguments;
      const expectedUrls = saveEntityArguments.map(arg => `${arg}`);
 
      expect(expectedUrls).toContain(`${objectId}/replies`);
      expect(expectedUrls).toContain(`${objectId}/likes`);
      expect(expectedUrls).toContain(`${objectId}/shares`);
    });
  });
});