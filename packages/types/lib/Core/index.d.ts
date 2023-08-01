/// <reference types="node" />
import { Link, Mention } from './Link';
import { Actor } from '../Extended/Actor';
import { Activity } from '../Extended/Activity';
import { AnyCollectionOrCollectionPage } from '../Extended/Collection';
import { ExtendedObject } from '../Extended';
export { CoreObjectProperties } from './CoreObject';
export type { Link, LinkReference, Mention } from './Link';
export type CoreObject = ExtendedObject | Actor | Activity | AnyCollectionOrCollectionPage;
export type CoreObjectReference = URL | CoreObject;
export type Entity = CoreObject | Link | Mention;
export type EntityReference = URL | Entity;
