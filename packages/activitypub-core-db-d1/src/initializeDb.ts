import { D1DbAdapter } from '.';
import { D1Database } from '@cloudflare/workers-types';

export async function initializeDb(this: D1DbAdapter): Promise<void> {
  if (!(this.db instanceof D1Database)) {
    throw new Error('Bad database type.');
  }

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS peer (
    _id TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
    )
    .bind()
    .run();

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS username (
    _id TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
    )
    .bind()
    .run();

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS privateKey (
    _id TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
    )
    .bind()
    .run();

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS account (
    _id TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );`,
    )
    .bind()
    .run();

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS entity (
    _id TEXT PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    "@context" TEXT,
    "to" TEXT,
    height INTEGER,
    href TEXT,
    hrefLang TEXT,
    mediaType TEXT,
    name TEXT,
    nameMap TEXT,
    preview TEXT,
    rel TEXT,
    width INTEGER,
    attachment TEXT,
    attributedTo TEXT,
    audience TEXT,
    bcc TEXT,
    bto TEXT,
    cc TEXT,
    content TEXT,
    contentMap TEXT,
    context TEXT,
    duration TEXT,
    endTime TEXT,
    generator TEXT,
    icon TEXT,
    image TEXT,
    inReplyTo TEXT,
    location TEXT,
    published TEXT,
    replies TEXT,
    startTime TEXT,
    summary TEXT,
    summaryMap TEXT,
    tag TEXT,
    updated TEXT,
    url TEXT,
    likes TEXT,
    shares TEXT,
    source TEXT,
    sensitive INTEGER,
    actor TEXT,
    object TEXT,
    target TEXT,
    result TEXT,
    origin TEXT,
    instrument TEXT,
    oneOf TEXT,
    anyOf TEXT,
    closed TEXT,
    inbox TEXT,
    outbox TEXT,
    following TEXT,
    followers TEXT,
    liked TEXT,
    preferredUsername TEXT,
    preferredUsernameMap TEXT,
    streams TEXT,
    endpoints TEXT,
    publicKey TEXT,
    manuallyApprovesFollowers INTEGER,
    totalItems INTEGER,
    items TEXT,
    current TEXT,
    first TEXT,
    last TEXT,
    orderedItems TEXT,
    startIndex INTEGER,
    formerType TEXT,
    deleted TEXT,
    subject TEXT,
    relationship TEXT,
    accuracy INTEGER,
    laltitude INTEGER,
    longitude INTEGER,
    radius INTEGER,
    units TEXT,
    describes TEXT
  );`,
    )
    .bind()
    .run();

  await this.db
    .prepare(
      `CREATE TABLE IF NOT EXISTS foreignEntity (
    _id TEXT PRIMARY KEY,
    id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL,
    "@context" TEXT,
    "to" TEXT,
    height INTEGER,
    href TEXT,
    hrefLang TEXT,
    mediaType TEXT,
    name TEXT,
    nameMap TEXT,
    preview TEXT,
    rel TEXT,
    width INTEGER,
    attachment TEXT,
    attributedTo TEXT,
    audience TEXT,
    bcc TEXT,
    bto TEXT,
    cc TEXT,
    content TEXT,
    contentMap TEXT,
    context TEXT,
    duration TEXT,
    endTime TEXT,
    generator TEXT,
    icon TEXT,
    image TEXT,
    inReplyTo TEXT,
    location TEXT,
    published TEXT,
    replies TEXT,
    startTime TEXT,
    summary TEXT,
    summaryMap TEXT,
    tag TEXT,
    updated TEXT,
    url TEXT,
    likes TEXT,
    shares TEXT,
    source TEXT,
    sensitive INTEGER,
    actor TEXT,
    object TEXT,
    target TEXT,
    result TEXT,
    origin TEXT,
    instrument TEXT,
    oneOf TEXT,
    anyOf TEXT,
    closed TEXT,
    inbox TEXT,
    outbox TEXT,
    following TEXT,
    followers TEXT,
    liked TEXT,
    preferredUsername TEXT,
    preferredUsernameMap TEXT,
    streams TEXT,
    endpoints TEXT,
    publicKey TEXT,
    manuallyApprovesFollowers INTEGER,
    totalItems INTEGER,
    items TEXT,
    current TEXT,
    first TEXT,
    last TEXT,
    orderedItems TEXT,
    startIndex INTEGER,
    formerType TEXT,
    deleted TEXT,
    subject TEXT,
    relationship TEXT,
    accuracy INTEGER,
    laltitude INTEGER,
    longitude INTEGER,
    radius INTEGER,
    units TEXT,
    describes TEXT
  );`,
    )
    .bind()
    .run();
}
