import { TypeOrArrayWithType, AnyType, OrArray } from '../util';

/**
 * A base ActivityStreams entity is a plain object that has at least a `type`.
 *
 * @note Technically all properties are optional, but this library requires a
 * `type` as a way to differentiate between different types of Entities.
 *
 * @todo Add better support for `@context`.
 */
export type BaseEntity<T extends AnyType> = {
  '@context'?: OrArray<URL | Record<string, URL>>;
  // Activity Pub allows null.
  id?: URL | null;
  type: T | TypeOrArrayWithType<T>;
};
