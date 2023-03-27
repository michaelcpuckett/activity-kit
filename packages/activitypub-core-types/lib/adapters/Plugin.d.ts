import * as AP from '../activitypub';
import { Adapters } from './';
export declare type Plugin = {
    handleCreateUserActor?: (this: {
        activity: AP.Activity & {
            object: AP.Actor;
        };
    }) => AP.Activity & {
        object: AP.Actor;
    };
    handleOutboxSideEffect?: (this: {
        activity: AP.Activity;
        actor: AP.Actor;
        adapters: Adapters;
    }) => Promise<void>;
    handleInboxSideEffect?: (this: {
        adapters: Adapters;
    }, activity: AP.Activity, recipient: AP.Actor) => Promise<void>;
    generateActorId?: (this: {
        adapters: Adapters;
    }, preferredUsername: string) => string;
    generateActorBaseId?: (this: {
        adapters: Adapters;
    }, preferredUsername: string) => string;
    generateActorOutboxId?: (this: {
        adapters: Adapters;
    }, preferredUsername: string) => string;
    generateObjectId?: (object: AP.ExtendedObject) => string;
    getHomePageProps?: (this: {
        adapters: Adapters;
    }, actor: AP.Actor, rawUrl: string) => Promise<object>;
    getEntityPageProps?: (this: {
        adapters: Adapters;
    }, entity: AP.Entity) => Promise<object>;
    getIsEntityGetRequest?: (url: string) => boolean;
    declareUserActorStreams?: (userActor: AP.Actor) => Array<{
        id: URL;
        url: URL;
        name: string;
    }>;
};
