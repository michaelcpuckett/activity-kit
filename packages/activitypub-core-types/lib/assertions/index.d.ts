import * as AP from '../activitypub';
import { AnyType } from '../activitypub/Core/Entity';
export declare function isTypeOf(entity: unknown & {
    type: string | string[];
}, values: Object): boolean;
export declare function isType(entity: unknown & {
    type: string | string[];
}, type: string): boolean;
export declare function assertExists(value: unknown): asserts value;
export declare function assertIsObject(value: unknown): asserts value is object;
export declare function assertIsArray(value: unknown): asserts value is Array<unknown>;
export declare function assertHasType(value: unknown): asserts value is {
    type: string | string[];
};
export declare function assertHasApType(value: unknown): asserts value is {
    type: AnyType | Array<AnyType | string>;
};
export declare function assertIsApEntity(value: unknown): asserts value is AP.Entity;
export declare function assertIsApActivity(value: unknown): asserts value is AP.Activity;
export declare function assertIsApExtendedObject(value: unknown): asserts value is AP.ExtendedObject;
export declare function assertIsApActor(value: unknown): asserts value is AP.Actor;
export declare function assertIsApCollection(value: unknown): asserts value is AP.Collection | AP.OrderedCollection;
export declare function assertIsApTransitiveActivity(value: unknown): asserts value is AP.TransitiveActivity;
export declare function assertIsApType<comparison>(value: unknown, comparison: string): asserts value is comparison;
