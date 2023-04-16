import { Core } from '.';
import { AP, assertIsApCollection } from '@activity-kit/types';
import { getId, isType } from '@activity-kit/utilities';

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

  try {
    assertIsApCollection(foundEntity);

    const items = await this.getCollectionItems(foundEntity);

    if (!items) {
      return foundEntity;
    }

    if (isType(foundEntity, AP.CollectionTypes.ORDERED_COLLECTION)) {
      return {
        ...foundEntity,
        orderedItems: items,
      };
    }

    if (isType(foundEntity, AP.CollectionTypes.COLLECTION)) {
      return {
        ...foundEntity,
        items,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}
