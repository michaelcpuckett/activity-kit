import 'jasmine';
import { handleFoundEntity } from '../../src/entity/handleFoundEntity';
import {
  actor1,
  actor1Id,
} from '../../test_data';
import {
  ACTIVITYSTREAMS_CONTENT_TYPE,
} from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';

describe('Entity', () => {
  describe('handleFoundEntity', () => {
    it('Responds to entity with AS content-type', async () => {
      let writtenEntityId: string | null = null;

      await (
        handleFoundEntity as unknown as (
          render: Function,
          entity: AP.Entity,
          authorizedActor: AP.Actor | null,
        ) => Promise<void>
      ).call(
        {
          req: {
            headers: {
              accept: [ACTIVITYSTREAMS_CONTENT_TYPE],
            },
          },
          url: new URL(actor1Id),
          res: {
            setHeader() {},
            write(writtenString: string) {
              writtenEntityId = JSON.parse(writtenString).id;
            },
            end() {},
          },
          adapters: {},
        },
        () => '',
        {
          ...actor1,
        },
        null,
      );

      expect(`${writtenEntityId}`).toBe(actor1Id);
    });
  });
});
