import * as AP from '@activity-kit/types';
import * as guard from './guard';

export function exists(value: unknown) {
  return guard.exists(value) ? value : undefined;
}

export function isObject(value: unknown) {
  return guard.isObject(value) ? value : undefined;
}

export function isString(value: unknown) {
  return guard.isString(value) ? value : undefined;
}

export function isNumber(value: unknown) {
  return guard.isNumber(value) ? value : undefined;
}

export function isDate(value: unknown) {
  return guard.isDate(value) ? value : undefined;
}

export function isArray(value: unknown) {
  return guard.isArray(value) ? value : undefined;
}

export function hasType(value: unknown) {
  return guard.hasType(value) ? value : undefined;
}

export function hasApType(value: unknown) {
  return guard.hasApType(value) ? value : undefined;
}

export function isApEntity(value: unknown) {
  return guard.isApEntity(value) ? value : undefined;
}

export function isApActivity(value: unknown) {
  return guard.isApActivity(value) ? value : undefined;
}

export function isApCoreObject(value: unknown) {
  return guard.isApCoreObject(value) ? value : undefined;
}

export function isApExtendedObject(value: unknown) {
  return guard.isApExtendedObject(value) ? value : undefined;
}

export function isApActor(value: unknown) {
  return guard.isApActor(value) ? value : undefined;
}

export function isApCollection(value: unknown) {
  return guard.isApCollection(value) ? value : undefined;
}

export function isApTransitiveActivity(value: unknown) {
  return guard.isApTransitiveActivity(value) ? value : undefined;
}

export function isApType<T extends AP.Entity>(value: unknown, type: string) {
  return guard.isType<T>(value, type) ? value : undefined;
}

export function isApTypeOf<T extends AP.Entity>(
  value: unknown,
  comparison: Record<string, string>,
) {
  return guard.isTypeOf<T>(value, comparison) ? value : undefined;
}
