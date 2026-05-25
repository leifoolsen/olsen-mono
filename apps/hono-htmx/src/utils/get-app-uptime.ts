import { SERVER_START_TIME } from './constants.ts';

export const getAppUptime = (): string => {
  const now = Temporal.Now.instant();
  const duration = now.since(SERVER_START_TIME).round({ largestUnit: 'day' });

  return new Intl.DurationFormat('no-NO', {
    style: 'narrow',
  }).format(duration);
};
