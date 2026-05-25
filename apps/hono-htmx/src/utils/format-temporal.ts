import { isPlainDate, isPlainTime, isPlainDateTime, isZonedDateTime } from '@olsen-mono/core-utils';

export const formatTemporal = (val: unknown, locale = 'no-NO'): string => {
  // 1. Ren dato (f.eks. "25. mai 2026")
  if (isPlainDate(val)) {
    return val.toLocaleString(locale, {
      dateStyle: 'medium',
    });
  }

  // 2. Ren tid (f.eks. "13:07:00")
  if (isPlainTime(val)) {
    return val.toLocaleString(locale, {
      timeStyle: 'medium',
    });
  }

  // 3. Dato og tid uten tidssone (f.eks. "25. mai 2026, 13:07:00")
  if (isPlainDateTime(val)) {
    return val.toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    });
  }

  // 4. Global tid med tidssone (f.eks. "25. mai 2026, 13:07:00 CEST")
  if (isZonedDateTime(val)) {
    return val.toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZoneName: 'short', // Viser f.eks. "CET" eller "CEST" automatisk
    });
  }

  return '';
};
