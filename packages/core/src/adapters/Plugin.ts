import * as AP from '../activitypub';
import { CoreLibrary, Routes } from './';

export type Plugin = {
  handleCreateUserActor?: (this: {
    core: CoreLibrary;
    routes: Routes;
    activity: AP.Activity & { object: AP.Actor };
  }) => Promise<AP.Activity & { object: AP.Actor }>;
  handleOutboxSideEffect?: (this: {
    activity: AP.Activity;
    actor: AP.Actor;
    core: CoreLibrary;
    routes: Routes;
  }) => Promise<void>;
  handleInboxSideEffect?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    activity: AP.Activity,
    recipient: AP.Actor,
  ) => Promise<void>;
  generateActorId?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    preferredUsername: string,
  ) => string;
  generateActorBaseId?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    preferredUsername: string,
  ) => string;
  generateActorOutboxId?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    preferredUsername: string,
  ) => string;
  generateObjectId?: (object: AP.ExtendedObject) => string;
  getHomePageProps?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    actor: AP.Actor,
    rawUrl: string,
  ) => Promise<object>;
  getEntityPageProps?: (
    this: {
      core: CoreLibrary;
      routes: Routes;
    },
    entity: AP.Entity,
  ) => Promise<object>;
  getIsEntityGetRequest?: (url: string) => boolean;
  declareUserActorStreams?: () => string[];
};
