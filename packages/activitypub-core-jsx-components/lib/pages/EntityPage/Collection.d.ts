/// <reference types="react" />
import { AP } from 'activitypub-core-types';
export declare function CollectionEntity({
  collection,
  actor,
  headingLevel,
}: {
  collection: AP.Collection;
  actor: AP.Actor;
  headingLevel: number;
}): JSX.Element;
