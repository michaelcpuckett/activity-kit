import { DatabaseService } from '.';
import { getCollectionNameByUrl } from '../utilities/getCollectionNameByUrl';

export async function insertOrderedItem(
  this: DatabaseService,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: 1,
      },
      $push: {
        orderedItems: {
          $each: [url.toString()],
          $position: 0,
        },
      },
    },
    {
      upsert: true,
    },
  );
}

export async function removeOrderedItem(
  this: DatabaseService,
  path: URL,
  url: URL,
) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: -1,
      },
      $pull: {
        orderedItems: url.toString(),
      },
    },
    {
      upsert: true,
    },
  );
}

export async function insertItem(this: DatabaseService, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: 1,
      },
      $push: {
        items: {
          $each: [url.toString()],
        },
      },
    },
    {
      upsert: true,
    },
  );
}

export async function removeItem(this: DatabaseService, path: URL, url: URL) {
  const collectionName = getCollectionNameByUrl(path);
  await this.db.collection(collectionName).updateOne(
    {
      _id: path.toString(),
    },
    {
      $inc: {
        totalItems: -1,
      },
      $pull: {
        items: url.toString(),
      },
    },
    {
      upsert: true,
    },
  );
}
