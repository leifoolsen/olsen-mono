// biome-ignore lint/suspicious/noExplicitAny: any is required to  for generics and Parameters<T> to behave as intended.
type AnyFunction = (...args: any[]) => void;

type DebouncedFunction<T extends AnyFunction> = {
  (...args: Parameters<T>): void;
  cancel(): void;
  flush(): void;
};

/**
 * Creates a debounced function that delays execution until after a specified wait time has elapsed
 * without further invocations. If the debounced function is called again before the wait time elapses,
 * the timeout is reset and the wait time starts over.
 *
 * @template T - The function type to debounce
 * @param func - The function to debounce
 * @param wait - Time in milliseconds to wait before executing. Default: 300ms
 * @param leading - If true, the function executes on the first call, then again after wait time elapses
 *                  on subsequent calls. Default: false
 *
 * @returns A debounced function with the following methods:
 *   - (...args) - Call to trigger the debounced execution
 *   - cancel() - Cancel the pending execution and clear any pending arguments
 *   - flush() - Execute the function immediately with the most recent arguments (if any are pending)
 *
 * @example
 * // Basic usage: execute after user stops typing
 * const searchFn = debounce((query: string) => {
 *   console.log('Searching for:', query);
 * }, 300);
 *
 * input.addEventListener('input', (e) => {
 *   searchFn(e.target.value);
 * });
 *
 * @example
 * // Leading execution: run immediately, then debounce subsequent calls
 * const validate = debounce((value: string) => {
 *   console.log('Validating:', value);
 * }, 500, true);
 *
 * validate('user input');      // Executes immediately
 * validate('more input');      // Queued, not executed yet
 * validate('even more');       // Resets timer
 * // After 500ms of no calls: final 'even more' is executed
 *
 * @example
 * // Using cancel and flush
 * const debounced = debounce(() => console.log('done'), 300);
 * debounced();
 * debounced.cancel();          // Prevent execution
 *
 * const debounced2 = debounce(() => console.log('done'), 300);
 * debounced2();
 * debounced2.flush();          // Execute immediately
 *
 * @warning
 * Do not call the debounced function from within its own callback.
 * This will cause infinite rescheduling of timeouts.
 *
 * ❌ Anti-pattern:
 * const debounced = debounce(() => {
 *   debounced(); // Recursive call - avoid!
 * }, 300);
 */
export function debounce<T extends AnyFunction>(func: T, wait = 300, leading = false): DebouncedFunction<T> {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  const debouncedFn = (...args: Parameters<T>): void => {
    const callNow = leading && !timeoutId;
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
