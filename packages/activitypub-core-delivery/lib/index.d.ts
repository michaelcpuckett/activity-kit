import type { CryptoAdapter, DbAdapter, FetchPolyfill } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
export declare class DeliveryAdapter {
    adapters: {
        db: DbAdapter;
        crypto: CryptoAdapter;
        fetch: FetchPolyfill;
    };
    constructor(config: {
        adapters: {
            db: DbAdapter;
            crypto: CryptoAdapter;
            fetch?: FetchPolyfill;
        };
    });
    signAndSendToForeignActorInbox: typeof signAndSendToForeignActorInbox;
    broadcast: typeof broadcast;
    getRecipientInboxUrls: typeof getRecipientInboxUrls;
    getRecipientsList: typeof getRecipientsList;
}
