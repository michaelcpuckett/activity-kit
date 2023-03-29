import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';

export async function insertOrderedItem(
  this: D1DbAdapter,
  path: URL,
  url: URL,
) {
  const currentRecord = (await this.findEntityById(
    path,
  )) as AP.OrderedCollection;
  const originalItems: URL[] = (currentRecord?.orderedItems as URL[]) ?? [];

  await this.saveEntity({
    ...currentRecord,
    totalItems: (currentRecord?.totalItems ?? 0) + 1,
    orderedItems: [url, ...originalItems],
  });
}

export async function removeOrderedItem(
  this: D1DbAdapter,
  path: URL,
  url: URL,
) {
  const currentRecord = (await this.findEntityById(
    path,
  )) as AP.OrderedCollection;
  const originalItems: URL[] = (currentRecord?.orderedItems as URL[]) ?? [];

  if (!originalItems.map((item) => item.toString()).includes(url.toString())) {
    return;
  }

  await this.saveEntity({
    ...currentRecord,
    totalItems: currentRecord.totalItems - 1,
    orderedItems: originalItems
      .map((item) => item.toString())
      .filter((item: string) => item !== url.toString())
      .map((item) => new URL(item)),
  });
}

export async function insertItem(this: D1DbAdapter, path: URL, url: URL) {
  const currentRecord = (await this.findEntityById(path)) as AP.Collection;
  const originalItems: URL[] = (currentRecord?.items as URL[]) ?? [];

  await this.saveEntity({
    ...currentRecord,
    totalItems: (currentRecord?.totalItems ?? 0) + 1,
    items: [url, ...originalItems],
  });
}

export async function removeItem(this: D1DbAdapter, path: URL, url: URL) {
  const currentRecord = (await this.findEntityById(
    path,
  )) as AP.OrderedCollection;
  const originalItems: URL[] = (currentRecord?.items as URL[]) ?? [];

  if (!originalItems.map((item) => item.toString()).includes(url.toString())) {
    return;
  }

  await this.saveEntity({
    ...currentRecord,
    totalItems: currentRecord.totalItems - 1,
    items: originalItems
      .map((item) => item.toString())
      .filter((item: string) => item !== url.toString())
      .map((item) => new URL(item)),
  });
}
