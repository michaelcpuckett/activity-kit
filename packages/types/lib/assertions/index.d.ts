import * as AP from '../activitypub';
import { AnyType } from '../activitypub/Core/Entity';
export declare function isTypeOf<T>(entity: unknown, types: Record<string, string>): entity is T;
export declare function isType<T>(entity: unknown, type: string): entity is T;
export declare function assertExists(value: unknown): asserts value;
export declare function assertIsObject(value: unknown): asserts value is object;
export declare function assertIsString(value: unknown): asserts value is string;
export declare function assertIsNumber(value: unknown): asserts value is number;
export declare function assertIsDate(value: unknown): asserts value is Date;
export declare function assertIsArray(value: unknown): asserts value is Array<unknown>;
export declare function assertHasType(value: unknown): asserts value is {
    type: string | string[];
};
export declare function assertHasApType(value: unknown): asserts value is {
    type: AnyType | Array<AnyType | string>;
};
export declare function assertIsApEntity(value: unknown): asserts value is AP.Entity;
export declare function assertIsApActivity(value: unknown): asserts value is AP.Activity;
export declare function assertIsApCoreObject(value: unknown): asserts value is AP.CoreObject;
export declare function assertIsApExtendedObject(value: unknown): asserts value is AP.ExtendedObject;
export declare function assertIsApActor(value: unknown): asserts value is AP.Actor;
export declare function assertIsApCollection(value: unknown): asserts value is AP.Collection | AP.OrderedCollection;
export declare function assertIsApTransitiveActivity(value: unknown): asserts value is AP.TransitiveActivity;
export declare function assertIsApType<comparison>(value: unknown, comparison: string): asserts value is comparison;
export declare function assertIsApTypeOf<types>(value: unknown, comparison: string[]): asserts value is types;
