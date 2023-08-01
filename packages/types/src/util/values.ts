/**
 * Shorthand for a plain object with string keys and string values.
 */
export type StringReferenceMap = Record<string, string>;

/**
 * Shorthand for a value of a given type or array of values that all conform
 * to that type.
 *
 * This is useful internally to represent many ActivityPub properties.
 *
 * @param T The type of the value to be mapped.
 *
 * @example
 * ```ts
 * // A string or array of strings.
 * type StringOrArrayOfStrings = OrArray<string>;
 *
 * const a: StringOrArrayOfStrings = 'foo';
 * const b: StringOrArrayOfStrings = ['foo', 'bar'];
 * ```
 */
export type OrArray<T> = T | T[];
