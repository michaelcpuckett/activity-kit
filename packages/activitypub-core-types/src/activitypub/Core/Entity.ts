import { AllTypes } from '../util/const';

export type AnyType = typeof AllTypes[keyof typeof AllTypes];

export type TypeOrArrayWithType<T> = T | Array<T & AnyType | string>;

export type BaseEntity = {
  '@context'?: URL | URL[] | unknown;
  // Activity Pub allows null.
  id?: URL | null;
  type: AnyType | Array<AnyType|string>;
};
