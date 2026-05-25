import { describe, it, expect } from 'vitest';
import { isPlainDateTime } from '../is-plain-date-time';

describe('isPlainDateTime', () => {
  it('should return true for Temporal.PlainDateTime', () => {
    const openingHour = Temporal.PlainDateTime.from({
      year: 2026,
      month: 12,
      day: 1,
      hour: 9,
      minute: 0,
    });

    expect(isPlainDateTime(openingHour)).toBe(true);
    expect(isPlainDateTime(Temporal.PlainDateTime.from('2026-12-24T17:00:00'))).toBe(true);
  });

  it('should return false for legacy Date objects', () => {
    expect(isPlainDateTime(new Date())).toBe(false);
  });

  it('should return false for Temporal other than PlainDateTime, plain objects and primitives', () => {
    const date = Temporal.PlainDate.from('2026-05-15');
    expect(isPlainDateTime(date)).toBe(false);
    const time = Temporal.PlainTime.from('12:00:00');
    expect(isPlainDateTime(time)).toBe(false);
    expect(isPlainDateTime({})).toBe(false);
    expect(isPlainDateTime('Temporal.FakeDate')).toBe(false);
    expect(isPlainDateTime(null)).toBe(false);
    expect(isPlainDateTime(undefined)).toBe(false);
  });
});
