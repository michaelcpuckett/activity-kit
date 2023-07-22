import * as AP from '@activity-kit/types';

export function convertEntityToJson(
  object: AP.Entity,
): Record<string, unknown> {
  return convertObject(object);
}

function convertObject(object: AP.Entity | Record<string, unknown>) {
  const converted: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(object)) {
    converted[key] = convertItem(value);
  }

  return converted;
}

function convertItem(item: unknown): unknown {
  if (item instanceof URL || item instanceof Date) {
    return item.toString();
  } else if (Array.isArray(item)) {
    return item.map(convertItem);
  } else if (item && typeof item === 'object') {
    const object: Record<string, unknown> = {};

    for (const objectKey of Object.keys(item)) {
      if (typeof objectKey === 'string') {
        object[objectKey] = item[objectKey];
      }
    }

    return convertObject(object);
  } else {
    return item;
  }
}
