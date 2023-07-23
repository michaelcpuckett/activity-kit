import * as AP from '@activity-kit/types';
export declare function exists(value: unknown): asserts value;
export declare function isObject(value: unknown): asserts value is object;
export declare function isString(value: unknown): asserts value is string;
export declare function isNumber(value: unknown): asserts value is number;
export declare function isDate(value: unknown): asserts value is Date;
export declare function isArray(value: unknown): asserts value is Array<unknown>;
export declare function hasType(value: unknown): asserts value is {
    type: string | string[];
};
export declare function hasApType(value: unknown): asserts value is {
    type: AP.AnyType | Array<AP.AnyType | string>;
};
export declare function isApEntity(value: unknown): asserts value is AP.Entity;
export declare function isApActivity(value: unknown): asserts value is AP.Activity;
export declare function isApCoreObject(value: unknown): asserts value is AP.CoreObject;
export declare function isApExtendedObject(value: unknown): asserts value is AP.ExtendedObject;
export declare function isApActor(value: unknown): asserts value is AP.Actor;
export declare function isApCollection(value: unknown): asserts value is AP.Collection | AP.OrderedCollection;
export declare function isApTransitiveActivity(value: unknown): asserts value is AP.TransitiveActivity<AP.AnyTransitiveActivityType>;
export declare function isApType<T extends AP.Entity>(value: unknown, type: string): asserts value is T;
export declare function isApTypeOf<T extends AP.Entity>(value: unknown, comparison: Record<string, string>): asserts value is T;
