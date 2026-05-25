import { formatTemporal } from './format-temporal';

export const getFormattedTime = (): string => {
  return formatTemporal(Temporal.Now.plainTimeISO());
};
