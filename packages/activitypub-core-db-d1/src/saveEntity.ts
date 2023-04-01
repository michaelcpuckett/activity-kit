import { D1DbAdapter } from '.';
import { AP } from 'activitypub-core-types';
import {
  applyContext,
  cleanProps,
  convertUrlsToStrings,
  getCollectionNameByUrl,
} from 'activitypub-core-utilities';
import { D1Database } from '@cloudflare/workers-types';

export async function saveEntity(this: D1DbAdapter, entity: AP.Entity) {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  if (!entity.id) {
    throw new Error('No ID.');
  }

  const collectionName = getCollectionNameByUrl(entity.id);
  const _id = entity.id.toString();
  const convertedEntity = {
    to: null,
    height: null,
    href: null,
    hrefLang: null,
    mediaType: null,
    name: null,
    nameMap: null,
    preview: null,
    rel: null,
    width: null,
    attachment: null,
    attributedTo: null,
    audience: null,
    bcc: null,
    bto: null,
    cc: null,
    content: null,
    contentMap: null,
    context: null,
    duration: null,
    endTime: null,
    generator: null,
    icon: null,
    image: null,
    inReplyTo: null,
    location: null,
    published: null,
    replies: null,
    startTime: null,
    summary: null,
    summaryMap: null,
    tag: null,
    updated: null,
    url: null,
    likes: null,
    shares: null,
    source: null,
    sensitive: null,
    actor: null,
    object: null,
    target: null,
    result: null,
    origin: null,
    instrument: null,
    oneOf: null,
    anyOf: null,
    closed: null,
    inbox: null,
    outbox: null,
    following: null,
    followers: null,
    liked: null,
    preferredUsername: null,
    preferredUsernameMap: null,
    streams: null,
    endpoints: null,
    publicKey: null,
    manuallyApprovesFollowers: null,
    totalItems: null,
    items: null,
    current: null,
    first: null,
    last: null,
    orderedItems: null,
    startIndex: null,
    formerType: null,
    deleted: null,
    subject: null,
    relationship: null,
    accuracy: null,
    laltitude: null,
    longitude: null,
    radius: null,
    units: null,
    describes: null,
    ...cleanProps(convertUrlsToStrings(applyContext(entity))),
    _id,
  };

  for (const key of Object.keys(convertedEntity)) {
    if (convertedEntity[key] && typeof convertedEntity[key] === 'object') {
      convertedEntity[key] = 'JSON:' + JSON.stringify(convertedEntity[key]);
    }
  }

  const existingRecord = await this.db
    .prepare(`SELECT * from ${collectionName} WHERE _id = ?;`)
    .bind(_id)
    .first();

  if (existingRecord) {
    const updateQuery = `UPDATE ${collectionName} SET ${Object.keys(
      convertedEntity,
    )
      .map((key) => `"${key}" = ?`)
      .join(', ')} WHERE _id = "${_id}";`;

    await this.db
      .prepare(updateQuery)
      .bind(Object.values(convertedEntity))
      .run();
  } else {
    const insertQuery = `INSERT INTO ${collectionName} ("${Object.keys(
      convertedEntity,
    ).join('", "')}") VALUES (${Object.keys(convertedEntity)
      .map(() => '?')
      .join(', ')});`;

    await this.db
      .prepare(insertQuery)
      .bind(Object.values(convertedEntity))
      .run();
  }
}