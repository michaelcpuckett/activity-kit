import { TypeOrArrayWithType, AnyType, OrArray } from '../util';

export type BaseEntity<T extends AnyType> = {
  '@context'?: OrArray<URL | Record<string, URL>>;
  // Activity Pub allows null.
  id?: URL | null;
  type: T | TypeOrArrayWithType<T>;
};
