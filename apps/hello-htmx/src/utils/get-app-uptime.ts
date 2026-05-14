import { SERVER_START_TIME } from './constants';

export const getAppUptime = (): string => {
  const now = Temporal.Now.instant();
  const duration = now.since(SERVER_START_TIME);
  return `${duration.hours}t ${duration.minutes}m ${duration.seconds}s`;
};
