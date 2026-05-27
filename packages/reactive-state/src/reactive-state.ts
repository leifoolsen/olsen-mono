import { type DeepPartial, isAtomic, isRecord } from '@olsen-mono/core-utils';

type Listener = () => void;

export type Binding<V> = {
  value: V;
  name: string;
  onChange: (newValue: V) => void;
};

// packages/object-builder/src/reactive-state.ts

export type ServerStore<T extends object> = {
  state: T; // Helt ren og stabil type uten rekursiv støy
  subscribe: (listener: Listener) => () => void;
  snapshot: () => T;
  bind: <V>(path: string) => Binding<V>;
};

export function createReactiveState<T extends object>(initial: DeepPartial<T>): ServerStore<T> {
  const _internalState = structuredClone(initial);
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

  // Hjelper for å hente eller opprette dype stier synkront
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

  // Hjelper for å opprette og sette dype stier typesikkert uten 'any'
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

        // Hvis det er et Map, pakker vi metodene fullstendig uten 'any'
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
    state: createProxy(_internalState as Record<PropertyKey, unknown>) as T,
    subscribe: (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot: () => structuredClone(_internalState) as unknown as T,
    bind: <V>(path: string): Binding<V> => {
      const parts = path.split('.');
      return {
        get value() {
          return getDeepValue(_internalState, parts) as V;
        },
        name: path,
        onChange: (newValue: V) => {
          setDeepValue(_internalState as Record<string, unknown>, parts, newValue);
        },
      };
    },
  };
}
