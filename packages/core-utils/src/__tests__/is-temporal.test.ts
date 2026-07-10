import { describe, expect, it } from 'vitest';
import { isTemporal } from '../is-temporal';

describe('isTemporal', () => {
  it('should return true for Temporal objects', () => {
    const date = Temporal.PlainDate.from('2026-05-15');
    const time = Temporal.PlainTime.from('12:00:00');

    expect(isTemporal(date)).toBe(true);
    expect(isTemporal(time)).toBe(true);
  });

  it('should return false for legacy Date objects', () => {
    expect(isTemporal(new Date())).toBe(false);
  });

  it('should return false for plain objects and primitives', () => {
    expect(isTemporal({})).toBe(false);
    expect(isTemporal('Temporal.FakeDate')).toBe(false);
    expect(isTemporal(null)).toBe(false);
    expect(isTemporal(undefined)).toBe(false);
  });
});
