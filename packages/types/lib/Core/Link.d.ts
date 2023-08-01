/// <reference types="node" />
import { BaseEntity } from './Entity';
import { LinkTypes, OrArray, StringReferenceMap } from '../util';
import { EntityReference } from '.';
export type AnyLinkType = (typeof LinkTypes)[keyof typeof LinkTypes];
export type LinkProperties = {
    height?: number;
    href?: URL;
    hrefLang?: string;
    mediaType?: string;
    name?: string;
    nameMap?: StringReferenceMap;
    preview?: OrArray<EntityReference>;
    rel?: OrArray<string>;
    width?: number;
};
export type BaseLink<T extends AnyLinkType> = BaseEntity<T> & LinkProperties;
export type LinkEntity = BaseLink<typeof LinkTypes.LINK>;
export type Mention = BaseLink<typeof LinkTypes.MENTION>;
export type Link = LinkEntity | Mention;
export type LinkReference = URL | Link;
