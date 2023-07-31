/// <reference types="node" />
import * as AP from '@activity-kit/types';
export declare function exists(value: unknown): value is string | number | object | boolean;
export declare function isObject(value: unknown): value is object;
export declare function isPlainObject(value: unknown): value is Record<string, unknown>;
export declare function isString(value: unknown): value is string;
export declare function isNumber(value: unknown): value is number;
export declare function isBoolean(value: unknown): value is boolean;
export declare function isDate(value: unknown): value is Date;
export declare function isUrl(value: unknown): value is URL;
export declare function isArray(value: unknown): value is Array<unknown>;
export declare function hasType(value: unknown): value is {
    type: string | string[];
};
export declare function hasApType(value: unknown): value is {
    type: AP.AnyType | AP.TypeOrArrayWithType<AP.AnyType>;
};
export declare function isApEntity(value: unknown): value is AP.Entity;
export declare function isApActivity(value: unknown): value is AP.Activity;
export declare function isApCoreObject(value: unknown): value is AP.CoreObject;
export declare function isApExtendedObject(value: unknown): value is AP.ExtendedObject;
export declare function isApActor(value: unknown): value is AP.Actor;
export declare function isApCollection(value: unknown): value is AP.EitherCollection;
export declare function isApCollectionPage(value: unknown): value is AP.EitherCollectionPage;
export declare function isApTransitiveActivity(value: unknown): value is AP.TransitiveActivity<AP.AnyTransitiveActivityType>;
export declare function isApType<T extends AP.Entity>(value: unknown, type: string): value is T;
export declare function isApTypeOf<T extends AP.Entity>(value: unknown, comparison: Record<string, string>): value is T;
