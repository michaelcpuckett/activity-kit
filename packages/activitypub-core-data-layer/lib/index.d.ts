import { AP, CryptoAdapter, DbAdapter, DbOptions, FetchPolyfill } from 'activitypub-core-types';
import { findEntityById } from './findEntityById';
import { fetchEntityById } from './fetchEntityById';
import { queryById } from './queryById';
import { expandEntity } from './expandEntity';
import { getPrivateKey } from './getPrivateKey';
import { getCollectionItems } from './getCollectionItems';
import { getPaginatedCollectionItems } from './getPaginatedCollectionItems';
import { expandCollection } from './expandCollection';
import { getActorByUserId } from './getActorByUserId';
import { broadcast } from './broadcast';
import { getRecipientUrls } from './getRecipientUrls';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
export declare class DataLayer {
    fetch: FetchPolyfill;
    initializeDb?: () => Promise<void>;
    findAll: (collection: string, matchingObject: {
        [key: string]: unknown;
    }) => Promise<AP.Entity[] | null>;
    findOne: (collection: string, matchingObject: {
        [key: string]: unknown;
    }, options?: Array<keyof typeof DbOptions>) => Promise<AP.Entity | null>;
    findStringIdByValue: (dbCollection: string, value: string) => Promise<string>;
    findStringValueById: (dbCollection: string, _id: string) => Promise<string>;
    insertItem: (path: URL, url: URL) => Promise<void>;
    removeItem: (path: URL, url: URL) => Promise<void>;
    insertOrderedItem: (path: URL, url: URL) => Promise<void>;
    removeOrderedItem: (path: URL, url: URL) => Promise<void>;
    saveEntity: (entity: AP.Entity) => Promise<void>;
    saveString: (dbCollection: string, _id: string, value: string) => Promise<void>;
    getGuid: () => Promise<string>;
    getHttpSignature: (foreignTarget: URL, actorId: URL, privateKey: string, entity?: AP.Entity) => Promise<{
        dateHeader: string;
        digestHeader?: string;
        signatureHeader: string;
    }>;
    constructor(adapters: {
        crypto: CryptoAdapter;
        db: DbAdapter;
        fetch?: FetchPolyfill;
    });
    findEntityById: typeof findEntityById;
    getActorByUserId: typeof getActorByUserId;
    getPrivateKey: typeof getPrivateKey;
    getStreamByName: (this: DataLayer, actor: AP.Actor, name: string) => Promise<AP.Collection | AP.OrderedCollection>;
    fetchEntityById: typeof fetchEntityById;
    queryById: typeof queryById;
    expandEntity: typeof expandEntity;
    getCollectionItems: typeof getCollectionItems;
    getPaginatedCollectionItems: typeof getPaginatedCollectionItems;
    expandCollection: typeof expandCollection;
    getRecipientInboxUrls: typeof getRecipientInboxUrls;
    getRecipientUrls: typeof getRecipientUrls;
    broadcast: typeof broadcast;
    signAndSendToForeignActorInbox: typeof signAndSendToForeignActorInbox;
}
