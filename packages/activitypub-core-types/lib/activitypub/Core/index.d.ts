/// <reference types="node" />
import { Link } from './Link';
import { ExtendedObject } from '../Extended/ExtendedObject';
import { Actor } from '../Extended/Actor';
import { Activity } from '../Extended/Activity';
import { Collection, OrderedCollection } from '../Extended/Collection';
import { CollectionPage, OrderedCollectionPage } from '../Extended/Collection';
export type { Link, LinkReference, Mention } from './Link';
export declare type CoreObject =
  | ExtendedObject
  | Actor
  | Activity
  | Collection
  | OrderedCollection
  | CollectionPage
  | OrderedCollectionPage;
export declare type CoreObjectReference = URL | CoreObject;
export declare type Entity = CoreObject | Link;
export declare type EntityReference = URL | CoreObject | Link;
