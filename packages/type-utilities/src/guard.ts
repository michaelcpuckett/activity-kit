import * as AP from '@activity-kit/types';

// TODO: isType === isApType ?

export function isType<T extends AP.Entity>(
  entity: unknown,
  type: string,
): entity is T {
  if (!entity || typeof entity !== 'object') {
    return false;
  }

  const entityType: string | string[] = (entity as T).type;

  return Array.isArray(entityType)
    ? entityType.includes(type)
    : type === entityType;
}

export function isTypeOf<T extends AP.Entity>(
  entity: unknown,
  types: Record<string, string>,
): entity is T {
  return Object.values(types).some((type) => isType<T>(entity, type));
}

export function exists(value: unknown): value is string | number | object {
  if (typeof value === 'undefined' || value === null) {
    return false;
  }

  return true;
}

export function isObject(value: unknown): value is object {
  return !!value && typeof value === 'object';
}

export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isArray(value: unknown): value is Array<unknown> {
  return Array.isArray(value);
}

export function hasType(value: unknown): value is { type: string | string[] } {
  return isObject(value) && 'type' in value;
}

export function hasApType(
  value: unknown,
): value is { type: AP.AnyType | Array<AP.AnyType | string> } {
  return hasType(value) && isTypeOf<AP.Entity>(value, AP.AllTypes);
}

export function isApEntity(value: unknown): value is AP.Entity {
  return hasApType(value);
}

export function isApActivity(value: unknown): value is AP.Activity {
  return isApEntity(value) && isTypeOf<AP.Activity>(value, AP.ActivityTypes);
}

export function isApCoreObject(value: unknown): value is AP.CoreObject {
  return (
    isApEntity(value) && isTypeOf<AP.CoreObject>(value, AP.CoreObjectTypes)
  );
}

export function isApExtendedObject(value: unknown): value is AP.ExtendedObject {
  return (
    isApEntity(value) &&
    isTypeOf<AP.ExtendedObject>(value, AP.ExtendedObjectTypes)
  );
}

export function isApActor(value: unknown): value is AP.Actor {
  return isApEntity(value) && isTypeOf<AP.Actor>(value, AP.ActorTypes);
}

export function isApCollection(
  value: unknown,
): value is AP.Collection | AP.OrderedCollection {
  return (
    isApEntity(value) &&
    isTypeOf<AP.EitherCollection>(value, AP.CollectionTypes)
  );
}

export function isApTransitiveActivity(
  value: unknown,
): value is AP.TransitiveActivity<AP.AnyTransitiveActivityType> {
  return isApActivity(value) && 'object' in value;
}

export function isApType<T extends AP.Entity>(
  value: unknown,
  type: string,
): value is T {
  return isApEntity(value) && isType<T>(value, type);
}

export function isApTypeOf<T extends AP.Entity>(
  value: unknown,
  comparison: Record<string, string>,
): value is T {
  return isApEntity(value) && isTypeOf<T>(value, comparison);
}
