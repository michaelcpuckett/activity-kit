import { AP } from 'activitypub-core-types';

export function removeContext(entity: AP.Entity): AP.Entity {
  const result = { ...entity };

  if ('@context' in result) {
    delete result['@context'];
  }

  for (const [key, value] of Object.entries(result)) {
    if (key === '@context') {
      delete result['@context'];
    } else if (Array.isArray(value)) {
      result[key] = value.map(handleArrayItem);
    } else if (value && typeof value === 'object' && 'type' in value) {
      result[key] = removeContext(value as AP.Entity);
    }
  }

  return result;
}

function handleArrayItem(item: unknown) {
  if (Array.isArray(item)) {
    return item.map(handleArrayItem);
  } else if (item && typeof item === 'object' && 'type' in item) {
    return removeContext(item as AP.Entity);
  } else {
    return item;
  }
}
