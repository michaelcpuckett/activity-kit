import 'jasmine';
import { AP } from 'activitypub-core-types';
import { GroupsPlugin } from '../src/index';
import { getId, isType, LOCAL_DOMAIN, LOCAL_HOSTNAME } from 'activitypub-core-utilities';

describe('Groups Plugin', () => {
  describe('Side Effect', () => {
    it('Handles Create Activity', async () => {
      const groupsPlugin = GroupsPlugin();

      const groupActorId = new URL(`${LOCAL_DOMAIN}/entity/group-actor`);
      const personActorId = new URL(`${LOCAL_DOMAIN}/entity/person`);
      const noteId = new URL(`${LOCAL_DOMAIN}/entity/note`);
      const createActivityId = new URL(`${LOCAL_DOMAIN}/entity/create`);

      const groupActor: AP.Group = {
        id: groupActorId,
        url: groupActorId,
        type: AP.ActorTypes.GROUP,
        inbox: new URL(`${groupActorId}/inbox`),
        outbox: new URL(`${groupActorId}/outbox`),
        followers: new URL(`${groupActorId}/followers`),
        streams: [new URL(`${groupActorId}/shared`)],
      };

      const shared: AP.OrderedCollection = {
        id: new URL(`${groupActorId}/shared`),
        url: new URL(`${groupActorId}/shared`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: groupActorId,
        orderedItems: [],
      };

      const groupFollowers = {
        id: `${groupActorId}/followers`,
        url: `${groupActorId}/followers`,
        type: AP.CollectionTypes.COLLECTION,
        attributedTo: groupActorId,
        items: [personActorId],
      };

      const personActor: AP.Person = {
        id: personActorId,
        url: personActorId,
        type: AP.ActorTypes.PERSON,
        inbox: new URL(`${personActorId}/inbox`),
        outbox: new URL(`${personActorId}/outbox`),
      };

      const note: AP.Note = {
        id: noteId,
        url: noteId,
        type: AP.ExtendedObjectTypes.NOTE,
        attributedTo: personActorId,
        content: 'Hello world!',
        shares: new URL(`${noteId}/shares`),
      };

      const noteShares: AP.OrderedCollection = {
        id: new URL(`${noteId}/shares`),
        url: new URL(`${noteId}/shares`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: personActorId,
        orderedItems: [],
      };

      const createActivity: AP.Create = {
        id: createActivityId,
        url: createActivityId,
        type: AP.ActivityTypes.CREATE,
        actor: personActorId,
        object: noteId,
      };

      const insertOrderedItemsArguments: URL[][] = [];
      const saveEntityArguments: Array<URL|null> = [];
      const broadcastCalls: Array<[AP.Activity, AP.Actor]> = [];

      await (groupsPlugin.handleInboxSideEffect as unknown as (activity: AP.Create, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          delivery: {
            async broadcast(activity: AP.Activity, actor: AP.Actor) {
              if (isType(activity, AP.ActivityTypes.ANNOUNCE)) {
                broadcastCalls.push([activity, actor]);
              }
            }
          },
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (name === 'Shared') {
                return shared;
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === `${noteId}`) {
                return note;
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === `${groupActorId}/followers`) {
                return groupFollowers;
              }

              if (entityId?.toString() === `${noteId}`) {
                return note;
              }
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertOrderedItemsArguments.push([collectionId, itemToInsert]);
            },
            async saveEntity(entity: AP.Entity) {
              saveEntityArguments.push(getId(entity));
            },
          }
        }
      }, createActivity, groupActor);

      expect(insertOrderedItemsArguments.length).toBe(3);
      expect(saveEntityArguments.length).toBe(4);
      expect(broadcastCalls.length).toBe(1);
    });

    it('Handles Create Activity with Object\'s InReplyTo', async () => {
      const groupsPlugin = GroupsPlugin();

      const groupActorId = new URL(`${LOCAL_DOMAIN}/entity/group-actor`);
      const personActorId = new URL(`${LOCAL_DOMAIN}/entity/person`);
      const noteId = new URL(`${LOCAL_DOMAIN}/entity/note`);
      const inReplyToId = new URL(`https://foreign-domain.net/note`);
      const createActivityId = new URL(`${LOCAL_DOMAIN}/entity/create`);

      const groupActor: AP.Group = {
        id: groupActorId,
        url: groupActorId,
        type: AP.ActorTypes.GROUP,
        preferredUsername: 'group123',
        inbox: new URL(`${groupActorId}/inbox`),
        outbox: new URL(`${groupActorId}/outbox`),
        followers: new URL(`${groupActorId}/followers`),
        streams: [new URL(`${groupActorId}/shared`)],
      };

      const shared: AP.OrderedCollection = {
        id: new URL(`${groupActorId}/shared`),
        url: new URL(`${groupActorId}/shared`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: groupActorId,
        orderedItems: [],
      };

      const groupFollowers = {
        id: `${groupActorId}/followers`,
        url: `${groupActorId}/followers`,
        type: AP.CollectionTypes.COLLECTION,
        attributedTo: groupActorId,
        items: [personActorId],
      };

      const personActor: AP.Person = {
        id: personActorId,
        url: personActorId,
        type: AP.ActorTypes.PERSON,
        inbox: new URL(`${personActorId}/inbox`),
        outbox: new URL(`${personActorId}/outbox`),
      };

      const note: AP.Note = {
        id: noteId,
        url: noteId,
        type: AP.ExtendedObjectTypes.NOTE,
        attributedTo: personActorId,
        content: `<p><span class=\"h-card\"><a href=\"${groupActorId}\" class=\"u-url mention\">@<span>group123</span></a></span></p>`,
        shares: new URL(`${noteId}/shares`),
        inReplyTo: inReplyToId,
      };

      const inReplyTo: AP.Note = {
        id: inReplyToId,
        url: inReplyToId,
        type: AP.ExtendedObjectTypes.NOTE,
        attributedTo: personActorId,
        content: 'Original',
      };

      const noteShares: AP.OrderedCollection = {
        id: new URL(`${noteId}/shares`),
        url: new URL(`${noteId}/shares`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: personActorId,
        orderedItems: [],
      };

      const createActivity: AP.Create = {
        id: createActivityId,
        url: createActivityId,
        type: AP.ActivityTypes.CREATE,
        actor: personActorId,
        object: noteId,
      };

      const insertOrderedItemsArguments: URL[][] = [];
      const saveEntityArguments: Array<URL|null> = [];
      const broadcastCalls: Array<[AP.Announce, AP.Actor]> = [];

      await (groupsPlugin.handleInboxSideEffect as unknown as (activity: AP.Create, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          delivery: {
            async broadcast(activity: AP.Announce, actor: AP.Actor) {
              if (isType(activity, AP.ActivityTypes.ANNOUNCE)) {
                broadcastCalls.push([activity, actor]);
              }
            }
          },
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (name === 'Shared') {
                return shared;
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === `${noteId}`) {
                return note;
              }

              if (entityId?.toString() === `${inReplyToId}`) {
                return inReplyTo;
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === `${groupActorId}/followers`) {
                return groupFollowers;
              }

              if (entityId?.toString() === `${noteId}`) {
                return note;
              }
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertOrderedItemsArguments.push([collectionId, itemToInsert]);
            },
            async saveEntity(entity: AP.Entity) {
              saveEntityArguments.push(getId(entity));
            },
          }
        }
      }, createActivity, groupActor);

      expect(broadcastCalls.length).toBe(1);
      expect(`${broadcastCalls[0][0].object}`).toBe(`${inReplyToId}`);
    });

    it('Does Not Duplicate Announcement', async () => {
      const groupsPlugin = GroupsPlugin();

      const groupActorId = new URL(`${LOCAL_DOMAIN}/entity/group-actor`);
      const personActorId = new URL(`${LOCAL_DOMAIN}/entity/person`);
      const noteId = new URL(`${LOCAL_DOMAIN}/entity/note`);
      const createActivityId = new URL(`${LOCAL_DOMAIN}/entity/create`);
      const announceActivityId = new URL(`${LOCAL_DOMAIN}/entity/announce}`);

      const announceActivity: AP.Announce = {
        id: announceActivityId,
        url: announceActivityId,
        type: AP.ActivityTypes.ANNOUNCE,
        actor: groupActorId,
        object: noteId,
      };

      const groupActor: AP.Group = {
        id: groupActorId,
        url: groupActorId,
        type: AP.ActorTypes.GROUP,
        inbox: new URL(`${groupActorId}/inbox`),
        outbox: new URL(`${groupActorId}/outbox`),
        followers: new URL(`${groupActorId}/followers`),
        streams: [new URL(`${groupActorId}/shared`)],
        preferredUsername: 'group123',
      };

      const shared: AP.OrderedCollection = {
        id: new URL(`${groupActorId}/shared`),
        url: new URL(`${groupActorId}/shared`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: groupActorId,
        orderedItems: [announceActivityId],
      };

      const groupFollowers = {
        id: `${groupActorId}/followers`,
        url: `${groupActorId}/followers`,
        type: AP.CollectionTypes.COLLECTION,
        attributedTo: groupActorId,
        items: [personActorId],
      };

      const personActor: AP.Person = {
        id: personActorId,
        url: personActorId,
        type: AP.ActorTypes.PERSON,
        inbox: new URL(`${personActorId}/inbox`),
        outbox: new URL(`${personActorId}/outbox`),
      };

      const note: AP.Note = {
        id: noteId,
        url: noteId,
        type: AP.ExtendedObjectTypes.NOTE,
        attributedTo: personActorId,
        content: `<p><a href="#">@group123@${LOCAL_HOSTNAME}</a></p>`,
        shares: new URL(`${noteId}/shares`),
      };

      const noteShares: AP.OrderedCollection = {
        id: new URL(`${noteId}/shares`),
        url: new URL(`${noteId}/shares`),
        type: AP.CollectionTypes.ORDERED_COLLECTION,
        attributedTo: personActorId,
        orderedItems: [],
      };

      const createActivity: AP.Create = {
        id: createActivityId,
        url: createActivityId,
        type: AP.ActivityTypes.CREATE,
        actor: personActorId,
        object: noteId,
      };

      const insertOrderedItemsArguments: URL[][] = [];
      const saveEntityArguments: Array<URL|null> = [];
      const broadcastCalls: Array<[AP.Activity, AP.Actor]> = [];

      await (groupsPlugin.handleInboxSideEffect as unknown as (activity: AP.Create, recipient: AP.Actor) => Promise<void>).call({
        adapters: {
          delivery: {
            async broadcast(activity: AP.Activity, actor: AP.Actor) {
              if (isType(activity, AP.ActivityTypes.ANNOUNCE)) {
                broadcastCalls.push([activity, actor]);
              }
            }
          },
          db: {
            async getStreamByName(actor: AP.Actor, name: string) {
              if (name === 'Shared') {
                return shared;
              }
            },
            async findEntityById(entityId: URL) {
              if (entityId?.toString() === `${announceActivityId}`) {
                return announceActivity;
              }

              if (entityId?.toString() === `${groupActorId}/followers`) {
                return groupFollowers;
              }

              if (entityId?.toString() === `${noteId}`) {
                return note;
              }
            },
            async queryById(entityId: URL) {
              if (entityId?.toString() === `${noteId}`) {
                return note;
              }
            },
            async insertOrderedItem(collectionId: URL, itemToInsert: URL) {
              insertOrderedItemsArguments.push([collectionId, itemToInsert]);
            },
            async saveEntity(entity: AP.Entity) {
              saveEntityArguments.push(getId(entity));
            },
          }
        }
      }, createActivity, groupActor);

      expect(insertOrderedItemsArguments.length).toBe(0);
      expect(saveEntityArguments.length).toBe(0);
      expect(broadcastCalls.length).toBe(0);
    });
  });
});