import { AP } from 'activitypub-core-types';

export function convertStringsToUrls(originalEntity: {
  [key: string]: unknown;
}): AP.Entity {
  const entity: { [key: string]: unknown } = { ...originalEntity };

  for (const [key, value] of Object.entries(entity)) {
    if (!entity) {
      continue;
    }

    if (typeof value === 'string') {
      try {
        if (value.startsWith('http')) {
          entity[key] = new URL(value);
        } else {
          const date = Date.parse(value);

          if (!Number.isNaN(date)) {
            entity[key] = new Date(date);
          }
        }
      } catch (error) {
        continue;
      }
    } else if (value instanceof URL || value instanceof Date) {
      continue;
    } else if (Array.isArray(value)) {
      entity[key] = value.map((item) => {
        if (typeof item === 'string') {
          try {
            if (item.startsWith('http')) {
              return new URL(item);
            } else {
              const date = Date.parse(item);

              if (!Number.isNaN(date)) {
                return new Date(date);
              } else {
                return item;
              }
            }
          } catch (error) {
            return item;
          }
        } else if (Array.isArray(item)) {
          return item.map((arrayItem: AP.Entity) =>
            convertStringsToUrls(arrayItem as { [key: string]: unknown }),
          );
        } else if (value && typeof value === 'object') {
          return convertStringsToUrls(item);
        } else {
          return item;
        }
      });
    } else if (value && typeof value === 'object') {
      entity[key] = convertStringsToUrls(value as { [key: string]: unknown });
    }
  }

  return entity as unknown as AP.Entity;
}
