import { MongoDbAdapter } from '.';
import { getCollectionNameByUrl } from '@activity-kit/utilities';
import { Db } from 'mongodb';

export async function insertOrderedItem(
  this: MongoDbAdapter,
  path: URL,
  url: URL,
) {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
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
  this: MongoDbAdapter,
  path: URL,
  url: URL,
) {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
  const collectionName = getCollectionNameByUrl(path);

  const existingItem = this.findOne(collectionName, {
    _id: path.toString(),
    orderedItems: [url.toString()],
  });

  if (!existingItem) {
    return;
  }

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

export async function insertItem(this: MongoDbAdapter, path: URL, url: URL) {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
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

export async function removeItem(this: MongoDbAdapter, path: URL, url: URL) {
  if (!(this.db instanceof Db)) {
    throw new Error('Bad database.');
  }
  const collectionName = getCollectionNameByUrl(path);

  const existingItem = this.findOne(collectionName, {
    _id: path.toString(),
    items: [url.toString()],
  });

  if (!existingItem) {
    return;
  }

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
