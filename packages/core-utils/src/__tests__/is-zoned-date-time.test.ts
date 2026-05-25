import { describe, it, expect } from 'vitest';
import { isZonedDateTime } from '../is-zoned-date-time';

describe('isZonedDateTime', () => {
  it('should return true for Temporal.ZonedDateTime', () => {
    const scheduledEvent = Temporal.ZonedDateTime.from({
      year: 2026,
      month: 10,
      day: 15,
      hour: 15,
      minute: 0,
      timeZone: 'Europe/Oslo',
    });
    expect(isZonedDateTime(scheduledEvent)).toBe(true);

    const newYorkEventTime = scheduledEvent.withTimeZone('America/New_York');
    expect(isZonedDateTime(newYorkEventTime)).toBe(true);

    const departure = Temporal.ZonedDateTime.from('2026-06-20T08:30:00[Europe/Oslo]');
    expect(isZonedDateTime(departure)).toBe(true);
  });

  it('should return false for legacy Date objects', () => {
    expect(isZonedDateTime(new Date())).toBe(false);
  });

  it('should return false for Temporal other than ZonedDateTime, plain objects and primitives', () => {
    const date = Temporal.PlainDate.from('2026-05-15');
    expect(isZonedDateTime(date)).toBe(false);
    const time = Temporal.PlainTime.from('12:00:00');
    expect(isZonedDateTime(time)).toBe(false);
    expect(isZonedDateTime({})).toBe(false);
    expect(isZonedDateTime('Temporal.FakeDate')).toBe(false);
    expect(isZonedDateTime(null)).toBe(false);
    expect(isZonedDateTime(undefined)).toBe(false);
  });
});
