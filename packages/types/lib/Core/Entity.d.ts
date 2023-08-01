/// <reference types="node" />
import { TypeOrArrayWithType, AnyType, OrArray } from '../util';
/**
 * A base ActivityStreams Entity is a plain object that has at least a `type`
 * property.
 *
 * @todo Add better support for the `@context` property.
 */
export type BaseEntity<T extends AnyType> = {
    '@context'?: OrArray<URL | Record<string, URL>>;
    id?: URL | null;
    type: T | TypeOrArrayWithType<T>;
};
