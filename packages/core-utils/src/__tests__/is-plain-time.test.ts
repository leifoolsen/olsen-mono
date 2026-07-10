import { describe, expect, it } from 'vitest';
import { isPlainTime } from '../is-plain-time';

describe('isPlainTime', () => {
  it('should return true for Temporal.PlainDate', () => {
    const time = Temporal.PlainTime.from('12:00:00');
    expect(isPlainTime(time)).toBe(true);
  });

  it('should return false for legacy Date objects', () => {
    expect(isPlainTime(new Date())).toBe(false);
  });

  it('should return false for Temporal other than PlainDate, plain objects and primitives', () => {
    const date = Temporal.PlainDate.from('2026-05-15');
    expect(isPlainTime(date)).toBe(false);
    expect(isPlainTime({})).toBe(false);
    expect(isPlainTime('Temporal.FakeDate')).toBe(false);
    expect(isPlainTime(null)).toBe(false);
    expect(isPlainTime(undefined)).toBe(false);
  });
});
