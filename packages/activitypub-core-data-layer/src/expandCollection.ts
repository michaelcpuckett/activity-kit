import { DataLayer } from '.';
import { AP, assertIsApCollection } from 'activitypub-core-types';
import { getId, isType } from 'activitypub-core-utilities';

export async function expandCollection(
  this: DataLayer,
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
