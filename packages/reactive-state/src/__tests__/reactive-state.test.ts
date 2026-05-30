import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createReactiveState } from '../reactive-state';

describe('reactive-state', () => {
  type TestState = {
    user: {
      name: string;
      age?: number;
      settings?: {
        theme: 'light' | 'dark';
      };
    };
    tags: string[];
    counters: Map<string, number>;
  };

  let initial: TestState;

  beforeEach(() => {
    initial = {
      user: { name: 'John Doe' },
      tags: ['react', 'typescript'],
      counters: new Map([['hits', 1]]),
    };
  });

  describe('General', () => {
    it('should notify subscribers when a top-level property changes', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      store.state.user.name = 'Jane Doe';

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.state.user.name).toBe('Jane Doe');
    });

    it('should stop notifying a subscriber after unsubscribe has been called', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();

      const unsubscribe = store.subscribe(listener);

      store.state.user.name = 'First Update';

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).toHaveBeenCalledTimes(1);

      unsubscribe();

      store.state.user.name = 'Second Update';
      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle deep nested updates and notify', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      // Siden settings er valgfritt, sikrer vi at det eksisterer, akkurat som i vanlig kode
      if (!store.state.user.settings) store.state.user.settings = { theme: 'light' };
      store.state.user.settings.theme = 'dark';

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(store.state.user.settings.theme).toBe('dark');
      expect(listener).toHaveBeenCalled();
    });

    it('should not notify if the value is the same', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      store.state.user.name = 'John Doe'; // Same as initial

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).not.toHaveBeenCalled();
    });

    it('should support deleting properties and notify', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      delete (store.state.user as Record<PropertyKey, unknown>).name;

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(store.state.user.name).toBeUndefined();
      expect(listener).toHaveBeenCalled();
    });

    it('should return a clean object via snapshot()', () => {
      const store = createReactiveState(initial);
      store.state.user.name = 'Jane';

      const snapshot = store.snapshot();

      // Check that it's a plain object, not a proxy
      expect(snapshot.user.name).toBe('Jane');

      expect((snapshot as Record<PropertyKey, unknown>).__isProxy).toBeUndefined();
      expect(snapshot).not.toBe(initial); // Deep cloned
    });
  });

  describe('Binding Mechanism', () => {
    it('should provide a binding with the correct value and name', () => {
      const store = createReactiveState(initial);
      // Vi bruker butikkens innebygde bind-metode med en eksplisitt sti
      const nameBinding = store.bind<string>('user.name');

      expect(nameBinding.value).toBe('John Doe');
      expect(nameBinding.name).toBe('user.name');
    });

    it('should update state through the binding onChange', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      const nameBinding = store.bind<string>('user.name');
      nameBinding.onChange('Jane');

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(store.state.user.name).toBe('Jane');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('Atomic Types (Set, Map, Date)', () => {
    it('should handle Map mutations correctly', async () => {
      const store = createReactiveState(initial);
      const listener = vi.fn();
      store.subscribe(listener);

      store.state.counters.set('hits', 2);

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      // Note: Map.set mutates the object, our proxy detects this if implemented
      // or if the object itself is replaced.
      expect(store.state.counters.get('hits')).toBe(2);
      expect(listener).toHaveBeenCalled();
    });
  });

  describe('Object overwrite', () => {
    type TestState = {
      user: {
        id: number;
        name: string;
        profile?: {
          bio: string;
          avatarUrl: string;
        };
      };
      metadata: Record<string, string>;
    };

    it('should allow partial initialization but retain full strict types', () => {
      const store = createReactiveState<TestState>({
        user: { id: 42 },
      });

      store.state.user.name = 'Alice';

      expect(store.state.user.id).toBe(42);
      expect(store.state.user.name).toBe('Alice');
    });

    it('overwriting an object replaces it completely (destructive)', async () => {
      const store = createReactiveState<TestState>({
        user: { id: 1, name: 'John', profile: { bio: 'Original Bio', avatarUrl: 'old.png' } },
        metadata: {},
      });

      const listener = vi.fn();
      store.subscribe(listener);

      // KLIENT-ADVARSEL / DOKUMENTASJON:
      // Hvis en klient tildeler et nytt objekt til 'user', vil det gamle profile-objektet
      // forsvinne fullstendig. Dette er standard JavaScript-oppførsel som Proxyen bevarer.
      store.state.user = {
        id: 2,
        name: 'Jane',
        // 'profile' er utelatt her, så det blir slettet/overskrevet med undefined
      };

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.state.user.id).toBe(2);
      expect(store.state.user.name).toBe('Jane');
      expect(store.state.user.profile).toBeUndefined(); // Verifiserer destruktiv overskriving
    });

    it('is the clients responsibility to shallow/deep merge when preserving fields', async () => {
      const store = createReactiveState<TestState>({
        user: { id: 1, name: 'John', profile: { avatarUrl: 'old.png', bio: 'Keep this bio' } },
        metadata: {},
      });

      const listener = vi.fn();
      store.subscribe(listener);

      // Hvis klienten ønsker å bevare eksisterende verdier (f.eks. 'profile'),
      // er det klientens ansvar å hente ut nåværende tilstand og merge (shallow/deep merge)
      const currentProfile = store.state.user.profile;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const newProfile = { ...currentProfile!, avatarUrl: 'new.png' };

      store.state.user = {
        id: 1,
        name: 'John Updated',
        profile: newProfile,
      };

      await new Promise((resolve) => {
        queueMicrotask(<VoidFunction>resolve);
      });

      expect(listener).toHaveBeenCalledTimes(1);
      expect(store.state.user.name).toBe('John Updated');
      expect(store.state.user.profile?.bio).toBe('Keep this bio'); // Bevart!
      expect(store.state.user.profile?.avatarUrl).toBe('new.png'); // Oppdatert!
    });
  });
});
