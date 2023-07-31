import * as AP from '@activity-kit/types';
import { guard } from '@activity-kit/type-utilities';

import { CoreLibrary } from './adapters';

export const getCollectionItems: CoreLibrary['getCollectionItems'] =
  function getCollectionItems(
    this: CoreLibrary,
    entity: AP.EitherCollection,
  ): AP.EntityReference[] {
    const collectionItems: AP.EntityReference[] = [];

    if (guard.isArray(entity.orderedItems) && entity.orderedItems.length) {
      const orderedItems = entity.orderedItems.filter((item) => {
        return guard.isApEntity(item) || guard.isUrl(item);
      });

      collectionItems.push(...orderedItems);
    } else if (guard.isArray(entity.items) && entity.items.length) {
      const items = entity.items.filter((item) => {
        return guard.isApEntity(item) || guard.isUrl(item);
      });

      collectionItems.push(...items);
    }

    return collectionItems;
  };
