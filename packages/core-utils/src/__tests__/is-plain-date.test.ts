import { describe, expect, it } from 'vitest';
import { isPlainDate } from '../is-plain-date';

describe('isPlainDate', () => {
  it('should return true for Temporal.PlainDate', () => {
    const date = Temporal.PlainDate.from('2026-05-15');
    expect(isPlainDate(date)).toBe(true);
  });

  it('should return false for legacy Date objects', () => {
    expect(isPlainDate(new Date())).toBe(false);
  });

  it('should return false for Temporal other than PlainDate, plain objects and primitives', () => {
    const time = Temporal.PlainTime.from('12:00:00');
    expect(isPlainDate(time)).toBe(false);
    expect(isPlainDate({})).toBe(false);
    expect(isPlainDate('Temporal.FakeDate')).toBe(false);
    expect(isPlainDate(null)).toBe(false);
    expect(isPlainDate(undefined)).toBe(false);
  });
});
