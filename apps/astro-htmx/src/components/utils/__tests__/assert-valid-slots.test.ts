import { describe, expect, it } from 'vitest';
import { assertValidSlots } from '../assert-valid-slots';

describe('assertValidSlots', () => {
  const ALLOWED = ['icon', 'badge'] as const;

  it('should pass when all slot names matches', () => {
    const mockSlots = { icon: () => {}, default: () => {} };
    expect(() => assertValidSlots(mockSlots, ALLOWED, 'TestComp')).not.toThrow();
  });

  it('should fail when invalid slot name is provided', () => {
    const mockSlots = { invalidSlotName: () => {}, default: () => {} };
    expect(() => assertValidSlots(mockSlots, ALLOWED, 'TestComp')).toThrow(
      '[TestComp]: Invalid slot name "invalidSlotName". Allowed slots are: "icon", "badge".',
    );
  });
});
