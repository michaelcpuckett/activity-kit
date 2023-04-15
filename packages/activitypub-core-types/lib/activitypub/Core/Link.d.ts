import { BaseEntity, TypeOrArrayWithType } from './Entity';
import { LinkTypes } from '../util/const';
import { StringReferenceMap } from '../util/values';
import { EntityReference } from '.';
export interface BaseLink extends BaseEntity {
    type: TypeOrArrayWithType<typeof LinkTypes[keyof typeof LinkTypes]>;
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
export type Link = BaseLink | Mention;
export type LinkReference = URL | Link;
