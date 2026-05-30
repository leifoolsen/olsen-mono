import { beforeEach, describe, expect, it } from 'vitest';
import { createProxyBuilder } from '../proxy-builder';

describe('proxyBuilder', () => {
  describe('basic usage', () => {
    type TestState = {
      user: {
        id: number;
        name: string;
        details?: {
          address?: {
            street: string;
            city: string;
          };
          tags?: Set<string>;
        };
      };
      'app.config'?: {
        debug: boolean;
      };
      items: { id: string; value: number }[];
      startDate?: Date | null;
    };

    let initial: TestState;
    beforeEach(() => {
      initial = {
        user: { id: 1, name: 'John Doe' },
        items: [{ id: 'a', value: 10 }],
        startDate: null,
      };
    });

    it('set and get for primitives should work as expected', () => {
      const builder = createProxyBuilder<TestState>(initial);
      builder.user.name = 'Jane Doe';
      expect(builder.user.name).toBe('Jane Doe');

      const result = builder.build();
      expect(result.user.name).toBe('Jane Doe');
      expect(result.startDate).toBeNull();
    });

    it('atomic types should be cloned', () => {
      const initialDate = new Date('2026-04-05');
      const initialSet = new Set(['a', 'b']);

      const builder = createProxyBuilder<TestState>(initial);
      builder.startDate = initialDate;
      builder.user.details.tags = initialSet;

      const built = builder.build();
      expect(built.startDate).not.toBe(initialDate);
      expect(built.user.details?.tags).not.toBe(initialSet);
    });

    it('should work as expected with missing required fields in initial state', () => {
      type User = { id: number; name: string; age: number };

      const builder = createProxyBuilder<User>({ id: 1 });
      builder.name = 'Jane';
      builder.age = 30;

      const result = builder.build();
      expect(result).toEqual({ id: 1, name: 'Jane', age: 30 });
    });
  });

  describe('Array handling', () => {
    type TestState = {
      user: {
        id: number;
        name: string;
        details?: {
          tags?: string[];
        };
      };
      items: { id: string; value: number }[];
    };

    let initial: TestState;
    beforeEach(() => {
      initial = {
        user: { id: 1, name: 'John' },
        items: [{ id: 'a', value: 10 }],
      };
    });

    it('should modify an existing value in an array', () => {
      const builder = createProxyBuilder(initial);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      builder.items[0]!.value = 20;

      const built = builder.build();
      expect(built.items[0]?.value).toBe(20);
      expect(built).toEqual({ user: { id: 1, name: 'John' }, items: [{ id: 'a', value: 20 }] });
    });

    it('should push new item to an existing array', () => {
      const builder = createProxyBuilder(initial);
      builder.items.push({ id: 'b', value: 30 });

      const built = builder.build();
      expect(built.items.length).toBe(2);
      expect(built.items[1]?.value).toBe(30);
      expect(built).toEqual({
        user: { id: 1, name: 'John' },
        items: [
          { id: 'a', value: 10 },
          { id: 'b', value: 30 },
        ],
      });
    });

    it('should add a new array', () => {
      const builder = createProxyBuilder<TestState>({});
      builder.items = [{ id: 'b', value: 30 }];
      builder.user.details.tags = ['a', 'b'];

      const built = builder.build();
      expect(built.items.length).toBe(1);
      expect(built.items[0]?.value).toBe(30);
      expect(built).toEqual({
        items: [{ id: 'b', value: 30 }],
        user: { details: { tags: ['a', 'b'] } },
      });
    });

    it('should remove an item using splice', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // Standard array-metode for å fjerne elementer og oppdatere length
      builder.items.splice(0, 1);

      const built = builder.build();
      expect(built.items.length).toBe(0);
    });

    it('should handle clearing the entire array', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // Tømmer arrayen helt
      builder.items.length = 0;

      const built = builder.build();
      expect(built.items).toEqual([]);
      expect(built.items.length).toBe(0);
    });

    it('should support mapping over existing items to update them', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // builder.items returnerer proxyen til arrayen.
      // Vi kan bruke standard .map() på den.
      builder.items = builder.items.map((item) => ({
        ...item,
        value: item.value * 2,
      }));

      const built = builder.build();
      expect(built.items[0]?.value).toBe(20);
    });

    it('should handle unshift to add items at the beginning', () => {
      const builder = createProxyBuilder<TestState>(initial);
      builder.items.unshift({ id: 'first', value: 0 });

      const built = builder.build();
      expect(built.items[0]?.id).toBe('first');
      expect(built.items[1]?.id).toBe('a'); // Den opprinnelige 'a' er nå på index 1
      expect(built.items.length).toBe(2);
    });

    it('should delete a nested property within an array element', () => {
      // Oppdater typen til å inkludere metadata på en lovlig måte i testen
      type TestStateWithMetadata = TestState & {
        items: { id: string; value: number; metadata?: { note: string } }[];
      };

      const complexInitial: TestStateWithMetadata = {
        ...initial,
        items: [{ id: 'a', value: 10, metadata: { note: 'delete me' } }],
      };

      // Nå forstår TS6 nøyaktig hva du gjør uten 'as any'!
      const builder = createProxyBuilder<TestStateWithMetadata>(complexInitial);

      // delete builder.items[0].metadata;
      delete (builder.items[0] as { metadata?: unknown }).metadata;
      if (builder.items[0]?.metadata) Reflect.deleteProperty(builder.items[0], 'metadata');

      const built = builder.build();
      expect(built.items[0]?.metadata).toBeUndefined();
      expect(built.items[0]?.id).toBe('a');

      type TestStateWithOptionalMetadata = TestState & {
        items?: { id: string; value: number; metadata?: { note: string } }[];
      };

      const complexOptioalInitial: TestStateWithOptionalMetadata = {
        ...initial,
        items: [{ id: 'a', value: 10, metadata: { note: 'delete me' } }],
      };

      const builderWithOptional = createProxyBuilder<TestStateWithOptionalMetadata>(complexOptioalInitial);
      if (builderWithOptional.items[0]?.metadata) Reflect.deleteProperty(builderWithOptional.items[0], 'metadata');

      const builtWithDeletedOptional = builderWithOptional.build();
      expect(builtWithDeletedOptional.items[0]?.metadata).toBeUndefined();
    });

    it('should replace the entire array using merge', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // merge på toppnivå som overskriver items-arrayen
      builder.merge({
        items: [{ id: 'merged', value: 99 }],
      });

      const built = builder.build();
      expect(built.items.length).toBe(1);
      expect(built.items[0]?.id).toBe('merged');
    });
  });

  describe('Set handling', () => {
    type TestState = {
      user: {
        id: number;
        name: string;
        details?: {
          tags?: Set<string>;
        };
      };
      items: Set<{ id: string; value: number }>;
    };

    let initial: TestState;
    beforeEach(() => {
      initial = {
        user: { id: 1, name: 'John' },
        items: new Set([{ id: 'a', value: 10 }]),
      };
    });

    it('should add value to a Set even if path is missing', () => {
      const initialSet = new Set(['a', 'b']);
      const builder = createProxyBuilder<TestState>(initial);
      builder.user.details.tags = initialSet;
      builder.user.details.tags.add('c');

      builder.items.add({ id: 'b', value: 20 });

      const result = builder.build();
      expect(result.user.details?.tags?.has('c')).toBe(true);
      expect(result.user.details?.tags).toEqual(new Set(['a', 'b', 'c']));
      expect(result.user.details?.tags).not.toBe(initialSet);
    });

    it('should handle clearing a Set', () => {
      const builder = createProxyBuilder<TestState>(initial);

      builder.items.clear();

      const result = builder.build();
      expect(result.items.size).toBe(0);
    });

    it('should support deleting from Set', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // Hent elementet direkte fra builder-proxyen for å få riktig referanse
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const itemInBuilder = builder.items.values().next().value!;
      builder.items.delete(itemInBuilder);

      const result = builder.build();
      expect(result.items.size).toBe(0);
    });
  });

  describe('Map handling', () => {
    type TestState = {
      user: {
        id: number;
        name: string;
        details?: {
          tags?: Map<string, string>;
        };
      };
      items: Map<string, { id: string; value: number }>;
    };

    let initial: TestState;
    beforeEach(() => {
      initial = {
        user: { id: 1, name: 'John' },
        items: new Map([['a', { id: 'a', value: 10 }]]),
      };
    });

    it('should add value to a Map even if path is missing', () => {
      const initialMap = new Map([['key-1', 'Value #1']]);
      const builder = createProxyBuilder<TestState>(initial);
      builder.user.details.tags = initialMap;
      builder.user.details.tags.set('key-2', 'Value #2');

      const result = builder.build();
      expect(result.user.details?.tags?.has('key-2')).toBe(true);
      expect(result.user.details?.tags).toEqual(
        new Map([
          ['key-1', 'Value #1'],
          ['key-2', 'Value #2'],
        ]),
      );
      expect(result.user.details?.tags).not.toBe(initialMap);
    });

    it('should support deleting from a Map', () => {
      const builder = createProxyBuilder<TestState>(initial);

      // 1. Legg til og slett fra et nytt Map
      builder.user.details.tags = new Map([['temp', 'to be deleted']]);
      builder.user.details.tags.delete('temp');

      // 2. Slett det eksisterende elementet fra 'items'
      builder.items.delete('a');

      const result = builder.build();

      // Nå skal begge være 0
      expect(result.items.size).toBe(0);
      expect(result.user.details?.tags?.size).toBe(0);
    });

    it('should handle clearing a Map', () => {
      const builder = createProxyBuilder<TestState>(initial);

      builder.items.clear();

      const result = builder.build();
      expect(result.items.size).toBe(0);
    });

    it('should maintain internal object references inside Map when using build', () => {
      const builder = createProxyBuilder<TestState>(initial);
      const newItem = { id: 'b', value: 20 };

      builder.items.set('b', newItem);

      const result = builder.build();
      const extractedItem = result.items.get('b');

      // Sjekk at verdien er korrekt
      expect(extractedItem).toEqual(newItem);

      // Sjekk at det er en klone (ikke samme referanse som newItem) pga build() sin unwrap/structuredClone
      expect(extractedItem).not.toBe(newItem);
    });
  });

  describe('Date handling', () => {
    type TestState = {
      event: {
        id: string;
        startDate: Date;
        endDate?: Date;
      };
    };

    it('should support mutating an existing Date object', () => {
      const initialDate = new Date('2024-01-01T10:00:00Z');
      const builder = createProxyBuilder<TestState>({
        event: { id: '123', startDate: initialDate },
      });

      // 1. Endre året direkte på Date-objektet via proxyen
      builder.event.startDate.setFullYear(2025);

      const result = builder.build();

      // Verifiser at året er oppdatert
      expect(result.event.startDate.getFullYear()).toBe(2025);

      // Verifiser at det er en klone (ikke samme referanse som initialDate)
      expect(result.event.startDate).not.toBe(initialDate);
    });

    it('should handle adding a Date to a missing path', () => {
      const builder = createProxyBuilder<TestState>({
        event: { id: '123', startDate: new Date() },
      });

      const newEndDate = new Date('2024-12-31');

      // Siden endDate er optional og mangler i initial, tildeler vi den
      builder.event.endDate = newEndDate;

      // Vi kan nå mutere den etter tildeling
      builder.event.endDate.setHours(23, 59, 59);

      const result = builder.build();
      expect(result.event.endDate?.getHours()).toBe(23);
      expect(result.event.endDate).not.toBe(newEndDate);
    });
  });

  describe('peek', () => {
    type TestState = {
      event: {
        id: string;
        startDate: Date;
        endDate?: Date;
      };
    };

    it("'should return a new object reference on build() but same on peek()", () => {
      const initialDate = new Date('2024-01-01T10:00:00Z');
      const builder = createProxyBuilder<TestState>({
        event: { id: '123', startDate: initialDate },
      });

      builder.event.startDate.setFullYear(2025);

      const peeked = builder.peek();
      const result = builder.build();

      expect(peeked).toEqual(result);
      expect(peeked).not.toBe(result);
    });
  });
});
