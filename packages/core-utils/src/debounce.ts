// biome-ignore lint/suspicious/noExplicitAny: any is required to  for generics and Parameters<T> to behave as intended.
type AnyFunction = (...args: any[]) => void;

type DebouncedFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
};

/**
 * A simple debounce that executes a function after a given delay in milliseconds. If the callback
 * is called repeatedly before the timer times out, then the old timer is cleared and starts a fresh countdown.
 *
 * @param func - the function to debounce.
 * @param wait - time to wait, in milliseconds, before the function is executed.
 * @param immediate - run immediately on the first call.
 */
export function debounce<T extends AnyFunction>(func: T, wait = 300, immediate = false): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    const callNow = immediate && !timeoutId;
    lastArgs = args;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (lastArgs) {
        func(...lastArgs);
        lastArgs = null;
      }
    }, wait);

    if (callNow) func(...args);
  };

  debouncedFn.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastArgs = null;
  };

  debouncedFn.flush = (): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
  };

  return debouncedFn;
}
