import * as AP from '@activity-kit/types';
export declare function exists(value: unknown): string | number | object;
export declare function isObject(value: unknown): object;
export declare function isString(value: unknown): string;
export declare function isNumber(value: unknown): number;
export declare function isDate(value: unknown): Date;
export declare function isArray(value: unknown): unknown[];
export declare function hasType(value: unknown): {
    type: string | string[];
};
export declare function hasApType(value: unknown): {
    type: string[] | AP.AnyType;
};
export declare function isApEntity(value: unknown): AP.Entity;
export declare function isApActivity(value: unknown): AP.Activity;
export declare function isApCoreObject(value: unknown): AP.CoreObject;
export declare function isApExtendedObject(value: unknown): AP.ExtendedObject;
export declare function isApActor(value: unknown): AP.Actor;
export declare function isApCollection(value: unknown): AP.Collection | AP.OrderedCollection;
export declare function isApTransitiveActivity(value: unknown): AP.TransitiveActivity<AP.AnyTransitiveActivityType>;
export declare function isApType<T extends AP.Entity>(value: unknown, type: string): T;
export declare function isApTypeOf<T extends AP.Entity>(value: unknown, comparison: Record<string, string>): T;
