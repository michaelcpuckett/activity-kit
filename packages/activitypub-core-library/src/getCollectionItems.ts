import { CoreLibrary } from '.';
import { AP, assertIsApCollection } from 'activitypub-core-types';
import { getId } from 'activitypub-core-utilities';

export async function getCollectionItems(
  this: CoreLibrary,
  entity: AP.Collection | AP.OrderedCollection,
): Promise<AP.EntityReference[]> {
  try {
    assertIsApCollection(entity);

    const collectionItems = entity.orderedItems || entity.items;

    if (!Array.isArray(collectionItems)) {
      return [];
    }

    const result: AP.EntityReference[] = [];

    for (const item of collectionItems) {
      if (item instanceof URL) {
        const foundItem = await this.queryById(item);

        result.push(
          foundItem
            ? await this.expandEntity(foundItem)
            : {
                type: AP.CoreObjectTypes.TOMBSTONE,
                content: 'Not found',
              },
        );
      } else if (!Array.isArray(item)) {
        const foundItem = await this.queryById(getId(item));

        result.push(foundItem ?? item);
      }
    }

    return result;
  } catch (error) {
    return [];
  }
}
