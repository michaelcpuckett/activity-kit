/// <reference types="node" />
import * as AP from '@activity-kit/types';
export declare function exists(value: unknown): string | number | boolean | object | undefined;
export declare function isObject(value: unknown): object | undefined;
export declare function isPlainObject(value: unknown): Record<string, unknown> | undefined;
export declare function isString(value: unknown): string | undefined;
export declare function isBoolean(value: unknown): boolean | undefined;
export declare function isNumber(value: unknown): number | undefined;
export declare function isDate(value: unknown): Date | undefined;
export declare function isUrl(value: unknown): URL | undefined;
export declare function isArray(value: unknown): Array<unknown> | undefined;
export declare function hasType(value: unknown): {
    type: string | string[];
} | undefined;
export declare function hasApType(value: unknown): {
    type: AP.AnyType | AP.TypeOrArrayWithType<AP.AnyType>;
} | undefined;
export declare function isApEntity(value: unknown): AP.Entity | undefined;
export declare function isApActivity(value: unknown): AP.Activity | undefined;
export declare function isApCoreObject(value: unknown): AP.CoreObject | undefined;
export declare function isApExtendedObject(value: unknown): AP.ExtendedObject | undefined;
export declare function isApActor(value: unknown): AP.Actor | undefined;
export declare function isApCollection(value: unknown): AP.EitherCollection | undefined;
export declare function isApTransitiveActivity(value: unknown): AP.TransitiveActivity<AP.AnyTransitiveActivityType> | undefined;
export declare function isApType<T extends AP.Entity>(value: unknown, type: string): T | undefined;
export declare function isApTypeOf<T extends AP.Entity>(value: unknown, comparison: Record<string, string>): T | undefined;
