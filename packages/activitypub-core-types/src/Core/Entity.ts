import { AllTypes } from '../util/const';

export type BaseEntity = {
  '@context'?: URL | URL[] | unknown;
  // Activity Pub allows null.
  id?: URL | null;
  type: typeof AllTypes[keyof typeof AllTypes];
};
