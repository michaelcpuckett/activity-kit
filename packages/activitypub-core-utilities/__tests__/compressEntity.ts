import { AP } from 'activitypub-core-types';
import { compressEntity } from '../src/compressEntity';
import { ACTIVITYSTREAMS_CONTEXT } from '../src/globals';

describe('Utilities', () => {
  describe('compressEntity', () => {
    const actor1Url = `https://test.com/entity/123`;
    const actor1Result: AP.Person = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(actor1Url),
      url: new URL(actor1Url),
      type: 'Person',
      inbox: new URL(`${actor1Url}/inbox`),
      outbox: new URL(`${actor1Url}/outbox`),
      updated: new Date('2022-01-01'),
    };

    const object1Url = `https://test.com/entity/123`;
    const object1Result: AP.Note = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(object1Url),
      url: new URL(object1Url),
      type: 'Note',
      content: 'Test2',
    };
    const activity1Url = 'https://test.com/entity/456';
    const activity1Result: AP.Create = {
      '@context': new URL(ACTIVITYSTREAMS_CONTEXT),
      id: new URL(activity1Url),
      url: new URL(activity1Url),
      type: 'Create',
      actor: new URL(actor1Url),
      object: new URL(object1Url),
    };

    it('compresses', async () => {
      expect(
        compressEntity({
          ...activity1Result,
          actor: actor1Result,
          object: object1Result,
        }),
      ).toStrictEqual(activity1Result);
    });
  });
});
