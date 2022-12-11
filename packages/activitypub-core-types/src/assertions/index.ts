import * as AP from '../activitypub';
import { AnyType } from '../activitypub/Core/Entity';

export function isTypeOf(
  entity: unknown & {
    type: string | string[];
  },
  values: Object,
): boolean {
  for (const type of Object.values(values)) {
    if (isType(entity, type)) {
      return true;
    }
  }

  return false;
}

export function isType(
  entity: unknown & {
    type: string | string[];
  },
  type: string,
): boolean {
  if (
    Array.isArray(entity.type)
      ? entity.type.includes(type)
      : type === entity.type
  ) {
    return true;
  }

  return false;
}

export function assertExists(value: unknown): asserts value {
  if (typeof value === 'undefined' || value === null) {
    throw new Error('`value` is undefined or null.');
  }
}

export function assertIsObject(value: unknown): asserts value is object {
  if (typeof value !== 'object') {
    throw new Error('`value` is not an object');
  }
}

export function assertIsArray(value: unknown): asserts value is object {
  if (!Array.isArray(value)) {
    throw new Error('`value` is not an array');
  }
}

export function assertHasType(value: unknown): asserts value is { type: string | string[] } {
  assertIsObject(value);

  if (!('type' in value)) {
    throw new Error('`value` has no type.');
  }
}

export function assertHasApType(value: unknown): asserts value is { type: AnyType | Array<AnyType | string>; } {
  assertHasType(value);

  if (!isTypeOf(value, AP.AllTypes)) {
    throw new Error('`value` type is not an ActivityPub type.');
  }
}

export function assertIsApEntity(value: unknown): asserts value is AP.Activity {
  assertHasApType(value);
}

export function assertIsApActivity(value: unknown): asserts value is AP.Activity {
  assertIsApEntity(value);

  if (!isTypeOf(value, AP.ActivityTypes)) {
    throw new Error('`value` is not an Activity');
  }
}

export function assertIsApActor(value: unknown): asserts value is AP.Actor {
  assertIsApEntity(value);

  if (!isTypeOf(value, AP.ActorTypes)) {
    throw new Error('`value` is not an Actor');
  }
}

export function assertIsApTransitiveActivity(value: unknown): asserts value is AP.TransitiveActivity {
  assertIsApActivity(value);

  if (!('object' in value)) {
    throw new Error('`value` is not a TransitiveActivity.');
  }
}