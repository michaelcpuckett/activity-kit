import { EntityGetEndpoint } from '.';
import { AP } from 'activitypub-core-types';
export declare function handleFoundEntity(this: EntityGetEndpoint, render: (...args: unknown[]) => Promise<string>, entity: AP.Entity, authorizedActor?: AP.Actor): Promise<void>;
