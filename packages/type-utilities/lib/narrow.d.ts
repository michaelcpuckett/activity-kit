import * as AP from '@activity-kit/types';
export declare function exists(value: unknown): boolean;
export declare function isObject(value: unknown): boolean;
export declare function isPlainObject(value: unknown): boolean;
export declare function isString(value: unknown): boolean;
export declare function isNumber(value: unknown): boolean;
export declare function isBoolean(value: unknown): boolean;
export declare function isDate(value: unknown): boolean;
export declare function isUrl(value: unknown): boolean;
export declare function isArray(value: unknown): boolean;
export declare function hasType(value: unknown): boolean;
export declare function hasApType(value: unknown): boolean;
export declare function isApEntity(value: unknown): boolean;
export declare function isApActivity(value: unknown): boolean;
export declare function isApCoreObject(value: unknown): boolean;
export declare function isApExtendedObject(value: unknown): boolean;
export declare function isApActor(value: unknown): boolean;
export declare function isApCollection(value: unknown): boolean;
export declare function isApTransitiveActivity(value: unknown): boolean;
export declare function isApType<T extends AP.Entity>(value: unknown, type: string): boolean;
export declare function isApTypeOf<T extends AP.Entity>(value: unknown, comparison: Record<string, string>): boolean;
