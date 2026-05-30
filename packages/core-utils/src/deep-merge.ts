import { isAtomic } from './is-atomic';
import { isRecord } from './is-record';

/**
 * Deep merges two objects.
 * @remarks This function is a support function for the builders and intentionally mutates the target object.
 * @param target
 * @param source
 */
export function deepMerge(target: Record<PropertyKey, unknown>, source: Record<PropertyKey, unknown>): void {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];

    if (isRecord(sourceValue) && !isAtomic(sourceValue)) {
      const targetValue = target[key];

      if (!isRecord(targetValue)) {
        target[key] = {};
      }

      deepMerge(target[key] as Record<PropertyKey, unknown>, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
}
