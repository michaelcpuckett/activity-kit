/// <reference types="node" />
import { BaseEntity } from './Entity';
import { LinkTypes } from '../util/const';
import { StringReferenceMap } from '../util/values';
import { EntityReference } from '.';
export interface BaseLink extends BaseEntity {
  type: typeof LinkTypes[keyof typeof LinkTypes];
  height?: number;
  href?: URL;
  hrefLang?: string;
  mediaType?: string;
  name?: string;
  nameMap?: StringReferenceMap;
  preview?: EntityReference | EntityReference[];
  rel?: string | string[];
  width?: number;
}
export interface Mention extends BaseLink {
  type: typeof LinkTypes.MENTION;
}
export declare type Link = BaseLink | Mention;
export declare type LinkReference = URL | Link;
