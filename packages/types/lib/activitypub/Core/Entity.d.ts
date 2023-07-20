/// <reference types="node" />
import { TypeOrArrayWithType, AnyType } from '../util/const';
import { ContextDefinition } from 'jsonld';
export type BaseEntity<T extends AnyType> = {
    '@context'?: URL | URL[] | ContextDefinition;
    id?: URL | null;
    type: T | TypeOrArrayWithType<T>;
};
