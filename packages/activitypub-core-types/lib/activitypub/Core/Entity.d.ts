/// <reference types="node" />
import { AllTypes } from '../util/const';
export declare type AnyType = typeof AllTypes[keyof typeof AllTypes];
export declare type TypeOrArrayWithType<T> = T | Array<T & AnyType | string>;
export declare type BaseEntity = {
    '@context'?: URL | URL[] | unknown;
    id?: URL | null;
    type: AnyType | Array<AnyType | string>;
};
