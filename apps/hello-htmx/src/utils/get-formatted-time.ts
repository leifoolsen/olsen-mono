export const getFormattedTime = (): string => {
  return Temporal.Now.plainTimeISO().toLocaleString('no-NO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};
