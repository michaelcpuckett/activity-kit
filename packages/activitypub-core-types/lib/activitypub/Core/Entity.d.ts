/// <reference types="node" />
import { AllTypes } from '../util/const';
export declare type BaseEntity = {
  '@context'?: URL | URL[] | unknown;
  id?: URL | null;
  type: typeof AllTypes[keyof typeof AllTypes];
};
