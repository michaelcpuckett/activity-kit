import { Core } from '.';
import * as AP from '@activity-kit/types';
import { isTypeOf } from '@activity-kit/type-utilities';
import { getId } from '@activity-kit/utilities';

export async function expandCollection(
  this: Core,
  collection: AP.EitherCollectionReference,
): Promise<null | AP.EitherCollection> {
  const id = getId(collection);

  if (!id) {
    return null;
  }

  const foundEntity = await this.queryById(id);

  if (!foundEntity) {
    return null;
  }

  if (isTypeOf<AP.EitherCollection>(foundEntity, AP.CollectionTypes)) {
    const items = await this.getCollectionItems(foundEntity);

    if (!items) {
      return foundEntity;
    }

    if (
      Array.isArray(foundEntity.type)
        ? foundEntity.type.includes(AP.CollectionTypes.ORDERED_COLLECTION)
        : foundEntity.type === AP.CollectionTypes.ORDERED_COLLECTION
    ) {
      return {
        ...foundEntity,
        orderedItems: items,
      };
    }

    if (
      Array.isArray(foundEntity.type)
        ? foundEntity.type.includes(AP.CollectionTypes.COLLECTION)
        : foundEntity.type === AP.CollectionTypes.COLLECTION
    ) {
      return {
        ...foundEntity,
        items,
      };
    }
  }

  return null;
}
