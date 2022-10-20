import { getTypedEntity} from './getTypedEntity';
import { AP } from 'activitypub-core-types';

export function isTypeOf(entity: AP.Entity, values: Object): boolean {
  for (const type of Object.values(values)) {
    const typedObject = getTypedEntity(
      entity as { [key: string]: unknown },
    ) as AP.ExtendedObject;
    if (Array.isArray(typedObject.type) ? typedObject.type.includes(type) : type === typedObject.type) {
      return true;
    }
  }

  return false;
}