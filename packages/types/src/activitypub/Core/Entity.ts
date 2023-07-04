import { TypeOrArrayWithType, AnyType } from '../util/const';
import { ContextDefinition } from 'jsonld';

export type BaseEntity<T extends AnyType> = {
  '@context'?: URL | URL[] | ContextDefinition;
  // Activity Pub allows null.
  id?: URL | null;
  type: TypeOrArrayWithType<T>;
};
