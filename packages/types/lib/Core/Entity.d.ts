/// <reference types="node" />
import { TypeOrArrayWithType, AnyType, OrArray } from '../util';
export type BaseEntity<T extends AnyType> = {
    '@context'?: OrArray<URL | Record<string, URL>>;
    id?: URL | null;
    type: T | TypeOrArrayWithType<T>;
};
