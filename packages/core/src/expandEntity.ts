import { Core } from '.';
import * as AP from '@activity-kit/types';
import { isTypeOf } from '@activity-kit/type-utilities';
import { PUBLIC_ACTOR } from '@activity-kit/utilities';

export async function expandEntity(
  this: Core,
  entity: AP.Entity,
): Promise<AP.Entity | null> {
  const expandEntry = async (key: string, value: unknown) => {
    if (
      key === '_id' ||
      key === 'id' ||
      key === 'url' ||
      key === 'type' ||
      key === '@context' ||
      key === 'publicKey'
    ) {
      return value;
    } else if (value instanceof URL) {
      if (value.toString() === PUBLIC_ACTOR) {
        return value;
      } else {
        try {
          const foundEntity = await this.queryById(value);

          return foundEntity ?? value;
        } catch (error) {
          return value;
        }
      }
    } else if (Array.isArray(value)) {
      return await Promise.all(
        value.map(async (item) => await expandEntry('', item)),
      );
    } else {
      return value;
    }
  };

  const expanded: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(entity)) {
    expanded[key] = await expandEntry(key, value);
  }

  if (isTypeOf<AP.Entity>(expanded, AP.AllTypes)) {
    return expanded;
  }

  return null;
}
