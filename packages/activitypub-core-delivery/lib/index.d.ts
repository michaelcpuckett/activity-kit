import type { Database } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getPrivateKey } from './getPrivateKey';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
export declare class DeliveryAdapter {
    adapters: {
        database: Database;
        fetch: Function;
    };
    constructor(config: {
        adapters: {
            database: Database;
            fetch?: Function;
        };
    });
    getPrivateKey: typeof getPrivateKey;
    signAndSendToForeignActorInbox: typeof signAndSendToForeignActorInbox;
    broadcast: typeof broadcast;
    getRecipientInboxUrls: typeof getRecipientInboxUrls;
    getRecipientsList: typeof getRecipientsList;
}
