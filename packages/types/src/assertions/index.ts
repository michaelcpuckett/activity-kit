import * as AP from '../activitypub';

export function isType<T extends AP.Entity>(
  entity: unknown,
  type: string,
): entity is T {
  if (!entity || typeof entity !== 'object') {
    return false;
  }

  const entityType: string | string[] = (entity as T).type;

  if (
    Array.isArray(entityType) ? entityType.includes(type) : type === entityType
  ) {
    return true;
  }

  return false;
}

export function isTypeOf<T extends AP.Entity>(
  entity: unknown,
  types: Record<string, string>,
): entity is T {
  return Object.values(types).some((type) => isType<T>(entity, type));
}

export function assertExists(value: unknown): asserts value {
  if (typeof value === 'undefined' || value === null) {
    throw new Error(`"${value}" is undefined or null.`);
  }
}

export function assertIsObject(value: unknown): asserts value is object {
  if (typeof value !== 'object') {
    throw new Error(`"${value}" is not an object.`);
  }
}

export function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error(`"${value}" is not a string.`);
  }
}

export function assertIsNumber(value: unknown): asserts value is number {
  if (typeof value !== 'number') {
    throw new Error(`"${value}" is not a number.`);
  }
}

export function assertIsDate(value: unknown): asserts value is Date {
  if (!(value instanceof Date)) {
    throw new Error(`"${value}" is not a Date object.`);
  }
}

export function assertIsArray(value: unknown): asserts value is Array<unknown> {
  if (!Array.isArray(value)) {
    throw new Error(`"${value}" is not an array.`);
  }
}

export function assertHasType(
  value: unknown,
): asserts value is { type: string | string[] } {
  assertIsObject(value);

  if (!('type' in value)) {
    throw new Error(`"${value}" has no type.`);
  }
}

export function assertHasApType(
  value: unknown,
): asserts value is { type: AP.AnyType | Array<AP.AnyType | string> } {
  assertHasType(value);

  if (!isTypeOf<AP.Entity>(value, AP.AllTypes)) {
    throw new Error(`"${value}" type is not an ActivityPub type.`);
  }
}

export function assertIsApEntity(value: unknown): asserts value is AP.Entity {
  assertHasApType(value);
}

export function assertIsApActivity(
  value: unknown,
): asserts value is AP.Activity {
  assertIsApEntity(value);

  if (!isTypeOf<AP.Activity>(value, AP.ActivityTypes)) {
    throw new Error(`"${value}" is not an Activity`);
  }
}

export function assertIsApCoreObject(
  value: unknown,
): asserts value is AP.CoreObject {
  assertIsApEntity(value);

  if (!isTypeOf<AP.CoreObject>(value, AP.CoreObjectTypes)) {
    throw new Error(`"${value}" is not a Core Object`);
  }
}

export function assertIsApExtendedObject(
  value: unknown,
): asserts value is AP.ExtendedObject {
  assertIsApEntity(value);

  if (!isTypeOf<AP.ExtendedObject>(value, AP.ExtendedObjectTypes)) {
    throw new Error(`"${value}" is not an Extended Object`);
  }
}

export function assertIsApActor(value: unknown): asserts value is AP.Actor {
  assertIsApEntity(value);

  if (!isTypeOf<AP.Actor>(value, AP.ActorTypes)) {
    throw new Error(`"${value}" is not an Actor`);
  }
}

export function assertIsApCollection(
  value: unknown,
): asserts value is AP.Collection | AP.OrderedCollection {
  assertIsApEntity(value);

  if (!isTypeOf<AP.EitherCollection>(value, AP.CollectionTypes)) {
    throw new Error(`"${value}" is not a Collection`);
  }
}

export function assertIsApTransitiveActivity(
  value: unknown,
): asserts value is AP.TransitiveActivity<AP.AnyTransitiveActivityType> {
  assertIsApActivity(value);

  if (!('object' in value)) {
    throw new Error(`"${value}" is not a TransitiveActivity.`);
  }
}

export function assertIsApType<T extends AP.Entity>(
  value: unknown,
  type: string,
): asserts value is T {
  assertIsApEntity(value);

  if (!isType<T>(value, type)) {
    throw new Error(`"${value}" is not of type ${type}.`);
  }
}

export function assertIsApTypeOf<T extends AP.Entity>(
  value: unknown,
  comparison: Record<string, string>,
): asserts value is T {
  assertIsApEntity(value);

  if (!isTypeOf<T>(value, comparison)) {
    throw new Error(`"${value}" does not match any provided type.`);
  }
}
