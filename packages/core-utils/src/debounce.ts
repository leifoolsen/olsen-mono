/**
 * "Hack" for (...args: any[]) => void
 */
type AnyFunction = (...args: never[]) => void;

/**
 * A simple debounce that executes a function after a given delay in milliseconds. If the callback
 * is called repatedly before the the timer times out, then the old timer is cleared and starts a fresh countdown.
 *
 * @param func - the function to debounce.
 * @param wait - time to wait, in milliseconds, before the function i executed.
 */

export function debounce<T extends AnyFunction>(func: T, wait: number = 300) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, wait);
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFn;
}
