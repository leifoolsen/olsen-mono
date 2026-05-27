import { type DeepPartial, isAtomic, isRecord } from '@olsen-mono/core-utils';

/**
 * Represents a callback function that will be invoked with no arguments when an event, action, or condition occurs.
 *
 * Typically used to handle events or execute specific logic in response to triggers.
 */
type Listener = () => void;

/**
 * Defines a binding object that connects a value of a generic type `V` with a name and a change handler.
 *
 * @template V - The type of the value being bound.
 * @property {V} value - The current value of the binding.
 * @property {string} name - The name associated with the binding.
 * @property {(newValue: V) => void} onChange - A callback function invoked when the value changes. Receives the new value as an argument.
 */
type Binding<V> = {
  value: V;
  name: string;
  onChange: (newValue: V) => void;
};

/**
 * Represents a typed store that manages state and provides mechanisms
 * for subscribing to changes, taking snapshots, and binding state paths for updates.
 *
 * @template T Extends object type. Represents the shape of the managed state.
 *
 * @property {T} state - The current state managed by the store.
 * @property {(listener: Listener) => () => void} subscribe - Registers a listener for state changes. Returns an unsubscribe function.
 * @property {() => T} snapshot - Provides a static snapshot of the current state.
 * @property {<V>(path: string) => Binding<V>} bind - Binds a specific path within the state and returns a binding object for that path.
 */
type ReactiveState<T extends object> = {
  state: T;
  subscribe: (listener: Listener) => () => void;
  snapshot: () => T;
  bind: <V>(path: string) => Binding<V>;
};

/**
 * Creates a reactive state object that allows for fine-grained observation and management
 * of nested properties with reactive updates.
 *
 * @template T Extends object type. Represents the shape of the managed state.
 * @param {DeepPartial<T>} initialState - The initial state to be cloned and used as the base
 * reactive state.
 * @return {ReactiveState<T>} An object containing the reactive `state`, subscription management
 * methods, and utility functions for interacting with deeply nested properties.
 */
export function createReactiveState<T extends object>(initialState: DeepPartial<T>): ReactiveState<T> {
  const internalState = structuredClone(initialState);
  const listeners = new Set<Listener>();
  let isBatching = false;

  const notify = () => {
    if (isBatching) return;
    isBatching = true;
    queueMicrotask(() => {
      isBatching = false;
      listeners.forEach((l) => {
        l();
      });
    });
  };

  const getDeepValue = (obj: unknown, parts: string[]): unknown => {
    let curr = obj;
    for (const part of parts) {
      if (isRecord(curr)) {
        curr = curr[part];
      } else {
        return undefined;
      }
    }
    return curr;
  };

  const setDeepValue = (obj: Record<PropertyKey, unknown>, parts: string[], value: unknown) => {
    let curr = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const part = parts[i]!;
      const nextNode = curr[part];

      if (!(part in curr) || !isRecord(nextNode)) {
        const placeholder: Record<string, unknown> = {};
        curr[part] = placeholder;
        curr = placeholder;
      } else {
        curr = nextNode;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const lastPart = parts[parts.length - 1]!;
    curr[lastPart] = value;
    notify();
  };

  const createProxy = (target: Record<PropertyKey, unknown>, path: string[] = []): unknown => {
    return new Proxy(target, {
      get(obj, prop, receiver) {
        if (typeof prop !== 'string') {
          return Reflect.get(obj, prop, receiver);
        }

        const value = Reflect.get(obj, prop, receiver);

        if (value instanceof Map) {
          return new Proxy(value, {
            get(mapTarget, mapProp) {
              const method = Reflect.get(mapTarget, mapProp) as unknown;
              if (typeof method === 'function') {
                return (...args: unknown[]) => {
                  const result = (method as (...args: unknown[]) => unknown).apply(mapTarget, args);
                  if (['set', 'delete', 'clear'].includes(mapProp as string)) {
                    notify();
                  }
                  return result;
                };
              }
              return method;
            },
          });
        }

        if (value == null || isAtomic(value) || typeof value !== 'object') {
          return value;
        }

        return createProxy(value as Record<PropertyKey, unknown>, [...path, prop]);
      },

      set(obj, prop, value, receiver) {
        if (typeof prop !== 'string') return false;

        const oldValue = Reflect.get(obj, prop, receiver);
        if (oldValue === value) return true;

        const success = Reflect.set(obj, prop, value, receiver);
        if (success) {
          notify();
        }
        return success;
      },

      deleteProperty(obj, prop) {
        if (typeof prop !== 'string') return false;
        if (Reflect.has(obj, prop)) {
          const success = Reflect.deleteProperty(obj, prop);
          if (success) {
            notify();
          }
          return success;
        }
        return true;
      },
    });
  };

  return {
    state: createProxy(internalState as Record<PropertyKey, unknown>) as T,
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot: () => structuredClone(internalState) as unknown as T,
    bind: <V>(path: string): Binding<V> => {
      const parts = path.split('.');
      return {
        get value() {
          return getDeepValue(internalState, parts) as V;
        },
        name: path,
        onChange: (newValue: V) => {
          setDeepValue(internalState as Record<string, unknown>, parts, newValue);
        },
      };
    },
  };
}
