/**
 * Validates the slot names within a given set of slots against a list of allowed slot names
 * for a specific component. Throws an error if any invalid slot name is found.
 *
 * @param slots - A record containing slot names as keys and their corresponding content as values.
 * @param allowedSlots - A readonly array of allowed slot names for the component.
 * @param componentName - The name of the component being validated, used for error messaging.
 * @return Asserts that the provided slots object is a record containing only the allowed slot names plus the 'default' slot.
 */
export function assertValidSlots<T extends string>(
  slots: Record<string, unknown>,
  allowedSlots: readonly T[],
  componentName: string,
): asserts slots is Record<T | 'default', unknown> {
  const allowedSet = new Set<string>([...allowedSlots, 'default']);

  for (const slotName of Object.keys(slots)) {
    if (!allowedSet.has(slotName)) {
      throw new Error(
        `[${componentName}]: Invalid slot name "${slotName}". Allowed slots are: ${allowedSlots.map((s) => `"${s}"`).join(', ')}.`,
      );
    }
  }
}
