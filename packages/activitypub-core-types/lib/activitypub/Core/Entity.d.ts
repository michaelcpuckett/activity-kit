import { AllTypes } from '../util/const';
export declare type AnyType = typeof AllTypes[keyof typeof AllTypes];
export declare type TypeOrArrayWithType<Type> = Type | [Type, ...AnyType[]];
export declare type BaseEntity = {
    '@context'?: URL | URL[] | unknown;
    id?: URL | null;
    type: TypeOrArrayWithType<AnyType>;
};
