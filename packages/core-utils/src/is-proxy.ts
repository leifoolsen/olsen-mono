type ProxyMarker = {
  readonly __isProxy: true;
};

type NativeIsProxy = (value: unknown) => boolean;

/**
 * Resolves the native `util.types.isProxy` once at module load.
 *
 * `process.getBuiltinModule` is the synchronous, ESM-safe way to load a builtin
 * (Node.js >= 20.16 / 22.3, also supported by Bun and Deno). In browsers
 * `process` is undefined, so this resolves to `undefined`.
 */
const nativeIsProxy: NativeIsProxy | undefined = (() => {
  try {
    return globalThis.process?.getBuiltinModule?.('node:util')?.types.isProxy;
  } catch {
    return undefined;
  }
})();

/**
 * Checks if a given object is a proxy instance.
 *
 * This utility function determines whether the provided object is a proxy by
 * leveraging the native `util.types.isProxy` function when running in a
 * server runtime, or by checking for a custom `__isProxy` property on the object.
 *
 * Note: Proxies are transparent by design, so in browsers only proxies that
 * expose the `__isProxy` marker can be detected.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is a proxy; otherwise, `false`.
 */
export const isProxy = (obj: unknown): obj is object & ProxyMarker => {
  if (obj == null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false;
  }

  if (nativeIsProxy?.(obj)) {
    return true;
  }

  try {
    return Reflect.get(obj, '__isProxy') === true;
  } catch {
    return false;
  }
};
