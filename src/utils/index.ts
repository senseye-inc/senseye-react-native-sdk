/**
 * @returns The number of seconds elapsed since January 1, 1970 00:00:00 UTC.
 */
export const getCurrentTimestamp = () => {
  return Date.now() / 1000;
};
