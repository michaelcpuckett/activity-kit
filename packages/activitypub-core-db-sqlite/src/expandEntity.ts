import { SqliteDbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import { CONTEXT, PUBLIC_ACTOR } from 'activitypub-core-utilities';

export async function expandEntity(
  this: SqliteDbAdapter,
  originalEntity: AP.Entity,
): Promise<AP.Entity> {
  const entity: { [key: string]: unknown } = { ...originalEntity };

  for (const [key, value] of Object.entries(entity)) {
    if (
      key === 'id' ||
      key === 'url' ||
      key === 'type' ||
      key === CONTEXT ||
      key === '_id' ||
      key === 'publicKey'
    ) {
      continue;
    } else if (value instanceof URL) {
      if (!(value.toString() === PUBLIC_ACTOR)) {
        try {
          const foundEntity = await this.queryById(value);

          if (foundEntity) {
            entity[key] = foundEntity;
          }
        } catch (error) {
          continue;
        }
      }
    } else if (Array.isArray(value)) {
      const array = [...value];
      entity[key] = await Promise.all(
        array.map(async (item) => {
          if (item instanceof URL) {
            if (item.toString() === PUBLIC_ACTOR) {
              return item;
            }
            if (item instanceof URL) {
              const foundEntity = await this.queryById(item);

              if (foundEntity) {
                return foundEntity;
              }

              return item;
            }
            try {
              const url = new URL(item);
              const foundEntity = await this.queryById(url);

              if (foundEntity) {
                return foundEntity;
              }

              return item;
            } catch (error) {
              return item;
            }
          }
          return item;
        }),
      );
    }
  }

  return entity as unknown as AP.Entity;
}
