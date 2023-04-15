import * as AP from '../activitypub';
import { Library, Routes } from './';
export type Plugin = {
    handleCreateUserActor?: (this: {
        lib: Library;
        routes: Routes;
        activity: AP.Activity & {
            object: AP.Actor;
        };
    }) => Promise<AP.Activity & {
        object: AP.Actor;
    }>;
    handleOutboxSideEffect?: (this: {
        activity: AP.Activity;
        actor: AP.Actor;
        lib: Library;
        routes: Routes;
    }) => Promise<void>;
    handleInboxSideEffect?: (this: {
        lib: Library;
        routes: Routes;
    }, activity: AP.Activity, recipient: AP.Actor) => Promise<void>;
    generateActorId?: (this: {
        lib: Library;
        routes: Routes;
    }, preferredUsername: string) => string;
    generateActorBaseId?: (this: {
        lib: Library;
        routes: Routes;
    }, preferredUsername: string) => string;
    generateActorOutboxId?: (this: {
        lib: Library;
        routes: Routes;
    }, preferredUsername: string) => string;
    generateObjectId?: (object: AP.ExtendedObject) => string;
    getHomePageProps?: (this: {
        lib: Library;
        routes: Routes;
    }, actor: AP.Actor, rawUrl: string) => Promise<object>;
    getEntityPageProps?: (this: {
        lib: Library;
        routes: Routes;
    }, entity: AP.Entity) => Promise<object>;
    getIsEntityGetRequest?: (url: string) => boolean;
    declareUserActorStreams?: () => string[];
};
