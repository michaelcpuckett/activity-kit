import { ACTIVITYSTREAMS_CONTEXT } from '../src/globals';
import { AP } from 'activitypub-core-types';
import { isType, isTypeOf } from '../src/isType';

describe('utilities', () => {
  describe('isType', () => {
    it('detects person with string', async () => {
      const result = isType(
        {
          type: 'Person',
        },
        AP.ActorTypes.PERSON,
      );
      expect(result).toBe(true);
    });

    it('detects person with array', async () => {
      const result = isType(
        {
          type: 'Person',
        },
        AP.ActorTypes.PERSON,
      );
      expect(result).toBe(true);
    });

    it('detects person with mixed array', async () => {
      const result = isType(
        {
          type: ['foaf:Agent', 'Person'],
        },
        AP.ActorTypes.PERSON,
      );
      expect(result).toBe(true);
    });

    it('detects actor with string', async () => {
      const result = isTypeOf(
        {
          type: 'Person',
        },
        AP.ActorTypes,
      );
      expect(result).toBe(true);
    });

    it('detects actor with array', async () => {
      const result = isTypeOf(
        {
          type: ['Person'],
        },
        AP.ActorTypes,
      );
      expect(result).toBe(true);
    });

    it('detects actor with mixed array', async () => {
      const result = isTypeOf(
        {
          type: ['foaf:Agent', 'Person'],
        },
        AP.ActorTypes,
      );
      expect(result).toBe(true);
    });
  });
});
