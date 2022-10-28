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
