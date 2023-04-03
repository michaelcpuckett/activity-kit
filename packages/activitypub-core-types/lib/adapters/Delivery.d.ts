import * as AP from '../activitypub';
import { CryptoAdapter } from './Crypto';
import { DbAdapter } from './Db';
import { FetchPolyfill } from './FetchPolyfill';
export declare type DeliveryAdapter = {
    adapters: {
        db: DbAdapter;
        crypto: CryptoAdapter;
        fetch: FetchPolyfill;
    };
    signAndSendToForeignActorInbox: (this: DeliveryAdapter, foreignActorInbox: URL, actor: AP.Actor, activity: AP.Activity) => Promise<unknown>;
    broadcast: (this: DeliveryAdapter, activity: AP.Activity, actor: AP.Actor) => Promise<unknown>;
    getRecipientInboxUrls: (this: DeliveryAdapter, activity: AP.Activity, actor: AP.Actor) => Promise<URL[]>;
    getRecipientsList: (this: DeliveryAdapter, to: AP.EntityReference | AP.EntityReference[]) => Promise<URL[]>;
    isPublic: (this: DeliveryAdapter, activity: AP.Activity) => Promise<boolean>;
    getPeerInboxUrls: (this: DeliveryAdapter) => Promise<Array<URL>>;
};
