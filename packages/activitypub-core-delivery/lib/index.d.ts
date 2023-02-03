import type { DbAdapter } from 'activitypub-core-types';
import { broadcast } from './broadcast';
import { getRecipientInboxUrls } from './getRecipientInboxUrls';
import { getRecipientsList } from './getRecipientsList';
import { isPublic } from './isPublic';
import { getPeerInboxUrls } from './getPeerInboxUrls';
import { signAndSendToForeignActorInbox } from './signAndSendToForeignActorInbox';
export declare class DeliveryAdapter {
    adapters: {
        db: DbAdapter;
        fetch: Function;
    };
    constructor(config: {
        adapters: {
            db: DbAdapter;
            fetch?: Function;
        };
    });
    signAndSendToForeignActorInbox: typeof signAndSendToForeignActorInbox;
    broadcast: typeof broadcast;
    getRecipientInboxUrls: typeof getRecipientInboxUrls;
    getRecipientsList: typeof getRecipientsList;
    isPublic: typeof isPublic;
    getPeerInboxUrls: typeof getPeerInboxUrls;
}
