import { Core } from '.';
import { AP, isTypeOf } from '@activity-kit/types';
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

          if (foundEntity) {
            return foundEntity;
          }

          return value;
        } catch (error) {
          return value;
        }
      }
    } else if (Array.isArray(value)) {
      return await Promise.all(value.map(expandEntry));
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
