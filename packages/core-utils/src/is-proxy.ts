type ProxyMarker = {
  readonly __isProxy: true;
};

/**
 * Checks if a given object is a proxy instance.
 *
 * This utility function determines whether the provided object is a proxy by
 * leveraging the Node.js `util.types.isProxy` function if available, or by
 * checking for a custom `__isProxy` property on the object.
 *
 * @param obj - The object to check.
 * @returns `true` if the object is a proxy; otherwise, `false`.
 */
export const isProxy = (obj: unknown): obj is object & ProxyMarker => {
  if (obj == null || typeof obj !== 'object') {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/consistent-type-imports
    const { types } = require('node:util') as typeof import('node:util');

    if (types.isProxy(obj)) {
      return true;
    }
  } catch {
    /* Ignore */
  }

  try {
    return Reflect.get(obj, '__isProxy') === true;
  } catch {
    return false;
  }
};
