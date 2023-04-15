import { AllTypes } from '../util/const';
export type AnyType = typeof AllTypes[keyof typeof AllTypes];
export type TypeOrArrayWithType<Type> = Type | [Type, ...AnyType[]];
export type BaseEntity = {
    '@context'?: URL | URL[] | unknown;
    id?: URL | null;
    type: TypeOrArrayWithType<AnyType>;
};
