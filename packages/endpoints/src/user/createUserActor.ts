import {
  PUBLIC_ACTOR,
  SERVER_ACTOR_USERNAME,
  LOCAL_DOMAIN,
  SHARED_INBOX_ID,
  applyContext,
  getId,
} from '@activity-kit/utilities';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { UserPostEndpoint, User } from '.';
import { compile } from 'path-to-regexp';

export async function createUserActor(
  this: UserPostEndpoint,
  user: User,
  uid: string,
) {
  assert.isApActor(user);

  const { publicKey, privateKey } = await this.core.generateKeyPair();
  const publishedDate = new Date();

  const getRouteUrl = (route: string, data: Record<string, string>) =>
    new URL(
      `${LOCAL_DOMAIN}${compile(route, {
        validate: false,
      })(data)}`,
    );

  const firstType = (
    Array.isArray(user.type) ? user.type[0] : user.type
  ).toLowerCase();

  const userId = getRouteUrl(this.routes[firstType], {
    username: user.preferredUsername,
  });

  const entityRoute = userId.pathname;

  const inboxId = getRouteUrl(this.routes.inbox, {
    entityRoute,
  });

  const userInbox = applyContext<AP.OrderedCollection>({
    id: inboxId,
    url: inboxId,
    name: 'Inbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const outboxId = getRouteUrl(this.routes.outbox, {
    entityRoute,
  });

  const userOutbox = applyContext<AP.OrderedCollection>({
    id: outboxId,
    url: outboxId,
    name: 'Outbox',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const followersId = getRouteUrl(this.routes.followers, {
    entityRoute,
  });

  const userFollowers = applyContext<AP.Collection>({
    id: followersId,
    url: followersId,
    name: 'Followers',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const followingId = getRouteUrl(this.routes.following, {
    entityRoute,
  });

  const userFollowing = applyContext<AP.Collection>({
    id: followingId,
    url: followingId,
    name: 'Following',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const likedId = getRouteUrl(this.routes.liked, {
    entityRoute,
  });

  const userLiked = applyContext<AP.OrderedCollection>({
    id: likedId,
    url: likedId,
    name: 'Liked',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const sharedId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'shared',
  });

  const userShared = applyContext<AP.OrderedCollection>({
    id: sharedId,
    url: sharedId,
    name: 'Shared',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const blocksId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'blocks',
  });

  const userBlocks = applyContext<AP.Collection>({
    id: blocksId,
    url: blocksId,
    name: 'Blocks',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const userRequestsId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'requests',
  });

  const userRequests = applyContext<AP.Collection>({
    id: userRequestsId,
    url: userRequestsId,
    name: 'Requests',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const userListsId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'lists',
  });

  const userLists = applyContext<AP.Collection>({
    id: userListsId,
    url: userListsId,
    name: 'Lists',
    summary:
      'A user\'s set of curated lists of other users, such as "Friends Only".',
    type: AP.CollectionTypes.COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    items: [],
    published: publishedDate,
  });

  const userBookmarksId = getRouteUrl(this.routes.stream, {
    entityRoute,
    slug: 'bookmarks',
  });

  const userBookmarks = applyContext<AP.OrderedCollection>({
    id: userBookmarksId,
    url: userBookmarksId,
    name: 'Bookmarks',
    type: AP.CollectionTypes.ORDERED_COLLECTION,
    totalItems: 0,
    attributedTo: userId,
    orderedItems: [],
    published: publishedDate,
  });

  const uploadMediaId = getRouteUrl(this.routes.endpoint, {
    entityRoute,
    slug: 'upload-media',
  });

  const userActorProperties: {
    id: URL;
  } & AP.CoreObjectProperties &
    AP.ActorProperties = {
    id: userId,
    url: userId,
    name: user.name,
    preferredUsername: user.preferredUsername,
    inbox: userInbox.id,
    outbox: userOutbox.id,
    followers: userFollowers.id,
    following: userFollowing.id,
    liked: userLiked.id,
    streams: [
      userShared.id,
      userBlocks.id,
      userRequests.id,
      userLists.id,
      userBookmarks.id,
    ],
    endpoints: {
      sharedInbox: new URL(SHARED_INBOX_ID),
      uploadMedia: uploadMediaId,
    },
    publicKey: {
      id: `${userId}#main-key`,
      owner: `${userId}`,
      publicKeyPem: publicKey,
    },
    published: publishedDate,
  };

  let userActor: AP.Person | AP.Group = applyContext(
    user.type === AP.ActorTypes.GROUP
      ? {
          ...userActorProperties,
          type: AP.ActorTypes.GROUP,
        }
      : {
          ...userActorProperties,
          type: AP.ActorTypes.PERSON,
        },
  );

  assert.isApActor(userActor);

  const botActor = await this.core.findOne('entity', {
    preferredUsername: SERVER_ACTOR_USERNAME,
  });

  assert.isApActor(botActor);

  const createActorActivityId = getRouteUrl(this.routes.create, {
    guid: await this.core.getGuid(),
  });

  const createActorActivity = applyContext<AP.Create>({
    id: createActorActivityId,
    url: createActorActivityId,
    type: AP.ActivityTypes.CREATE,
    actor: botActor,
    object: userActor,
    to: [new URL(PUBLIC_ACTOR)],
    published: publishedDate,
  });

  const declaredStreams = [];

  if (this.plugins) {
    for (const plugin of this.plugins) {
      if ('handleCreateUserActor' in plugin) {
        const pluginActivity = await plugin.handleCreateUserActor.call({
          activity: createActorActivity,
          core: this.core,
        });

        assert.isApActor(pluginActivity.object);

        userActor = pluginActivity.object;
      }

      if ('declareUserActorStreams' in plugin) {
        const streamsNames: string[] = plugin.declareUserActorStreams() ?? [];

        await Promise.all(
          streamsNames.map(async (streamName) => {
            const streamId = getRouteUrl(this.routes.stream, {
              entityRoute,
              slug: streamName
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-+|-+$/g, ''),
            });

            userActor.streams.push(streamId);

            declaredStreams.push(
              this.core.saveEntity(
                applyContext<AP.OrderedCollection>({
                  type: AP.CollectionTypes.ORDERED_COLLECTION,
                  totalItems: 0,
                  attributedTo: userId,
                  orderedItems: [],
                  published: publishedDate,
                  name: streamName,
                  id: streamId,
                  url: streamId,
                }),
              ),
            );
          }),
        );
      }
    }
  }

  await Promise.all([
    this.core.saveEntity(createActorActivity),
    this.core.saveEntity(userActor),
    this.core.saveEntity(userInbox),
    this.core.saveEntity(userOutbox),
    this.core.saveEntity(userLiked),
    this.core.saveEntity(userFollowers),
    this.core.saveEntity(userFollowing),
    this.core.saveEntity(userShared),
    this.core.saveEntity(userRequests),
    this.core.saveEntity(userBlocks),
    this.core.saveEntity(userLists),
    this.core.saveEntity(userBookmarks),
    this.core.saveString('account', uid, user.email),
    this.core.saveString('privateKey', uid, privateKey),
    this.core.saveString('username', uid, user.preferredUsername),
  ]);

  await Promise.all(declaredStreams);

  if (createActorActivity.id && userInbox.id) {
    await Promise.all([
      this.core.insertOrderedItem(
        getId(botActor.outbox),
        createActorActivity.id,
      ),
      this.core.insertOrderedItem(userInbox.id, createActorActivity.id),
    ]);
  }

  // Broadcast to Fediverse.
  this.core.broadcast(createActorActivity, botActor);
}
