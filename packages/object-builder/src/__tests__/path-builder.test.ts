import { beforeEach, describe, expect, it } from 'vitest';
import { createPathBuilder, type DeepPartial, type PathBuilder } from '../path-builder';

describe('path-builder', () => {
  type TestState = {
    user: {
      id: number;
      name: string;
      details?: {
        lastLogin: Date;
        tags: Set<string>;
        settings: Map<string, boolean>;
      };
    };
    'app.config'?: {
      debug: boolean;
    };
    items: { id: string; value: number }[];
  };

  const initial: DeepPartial<TestState> = {
    user: { id: 1, name: 'John Doe' },
    items: [{ id: 'a', value: 10 }],
  };

  let builder: PathBuilder<DeepPartial<TestState>>;

  beforeEach(() => {
    builder = createPathBuilder(initial);
  });

  describe('Basic Operations & Navigation', () => {
    it('should update a top-level property', () => {
      builder.set('user.name', 'Jane Doe');
      expect(builder.peek().user?.name).toBe('Jane Doe');
    });

    it('should create nested structures on the fly', () => {
      // app.config is undefined in initial
      builder.set('app\\.config.debug', true as never);
      expect(builder.peek()['app.config']?.debug).toBe(true);
    });

    it('should update array elements by index', () => {
      builder.set('items.0.value', 99);
      expect(builder.peek().items?.[0]?.value).toBe(99);
    });

    it('should remove elements from arrays and shift remaining items', () => {
      builder.set('items.1.id', 'b').set('items.1.value', 20);
      expect(builder.peek().items).toHaveLength(2);

      builder.remove('items.0');
      expect(builder.peek().items).toHaveLength(1);
      expect(builder.peek().items?.[0]?.id).toBe('b');
    });
  });

  describe('Atomic Types (Edge Cases)', () => {
    it('should handle Date objects without recursion', () => {
      const date = new Date('2024-01-01');
      builder.set('user.details.lastLogin', date);

      const peekedDate = builder.peek().user?.details?.lastLogin;
      expect(peekedDate).toBeInstanceOf(Date);
      expect(peekedDate?.getFullYear()).toBe(2024);
    });

    it('should handle Set and Map as atomic units', () => {
      const tags = new Set(['admin', 'editor']);
      const settings = new Map([['notifications', true]]);

      builder.set('user.details.tags', tags).set('user.details.settings', settings);

      const state = builder.peek();
      expect(state.user?.details?.tags).toBeInstanceOf(Set);
      expect(state.user?.details?.tags?.has('admin')).toBe(true);
      expect(state.user?.details?.settings?.get('notifications')).toBe(true);
    });

    it('should ensure immutability via build() for Atomic Types', () => {
      const tags = new Set(['initial']);
      builder.set('user.details.tags', tags);

      const built = builder.build();
      tags.add('mutated'); // Modifying the source set

      expect(built.user?.details?.tags?.has('mutated')).toBe(false);
      expect(built.user?.details?.tags?.size).toBe(1);
    });
  });

  describe('Merging & Deep Merging', () => {
    it('should perform a deep merge without losing existing sibling properties', () => {
      builder.set('user.details.lastLogin', new Date());

      // Merging into 'user' should keep 'id' and 'details.lastLogin'
      builder.merge('user', { name: 'New Name' });

      const state = builder.peek();
      expect(state.user?.name).toBe('New Name');
      expect(state.user?.id).toBe(1);
      expect(state.user?.details?.lastLogin).toBeInstanceOf(Date);
    });

    it('should overwrite Atomic Types during merge instead of merging their internals', () => {
      const oldDate = new Date('2000-01-01');
      builder.set('user.details.lastLogin', oldDate);

      const newDate = new Date('2025-01-01');
      builder.merge('user.details', { lastLogin: newDate });

      expect(builder.peek().user?.details?.lastLogin?.getFullYear()).toBe(2025);
    });
  });

  describe('State Control', () => {
    it('should reset the state to a new provided initial object', () => {
      builder.set('user.name', 'Changed');
      const resetTo: TestState = { user: { id: 99, name: 'Reset' }, items: [] };

      builder.reset(resetTo);
      expect(builder.peek().user?.id).toBe(99);
      expect(builder.peek().user?.name).toBe('Reset');
    });

    it('should return a new object reference on build() but same on peek()', () => {
      const stateBefore = builder.peek();
      const stateAfter = builder.peek();
      const builtState = builder.build();

      expect(stateBefore).toBe(stateAfter); // Reference equality
      expect(stateBefore).not.toBe(builtState); // Deep clone equality
      expect(stateBefore).toEqual(builtState); // Value equality
    });
  });
});

describe.skip('#pathBuilder path checks', () => {
  type User = {
    id: number;
    name: string;
    email: string | null;
    roles: string[];
    isAdmin: boolean;
  };
  type Tag = {
    id: string;
    label: string;
    createdAt: Date;
  };

  type MockData = {
    id: string;
    note: string;
    user: User;
    'app.config': {
      debug: boolean;
    };
    tags: Tag[];
    readonly createdAt: Date;
    readonly updatedAt: Date;
    coordinates: [number, number];
  };

  it('should set', () => {
    type PartialMock = DeepPartial<MockData>;
    const mockData: PartialMock = {
      id: '123',
    };

    const builder = createPathBuilder<PartialMock>(mockData);
    const result = builder
      .set('note', 'Tesing note!')
      .set('user.name', 'Ken')
      .set('user.email', null)
      .set('user.isAdmin', true)
      .set('tags', [{ id: 't1', label: 'Tag #1', createdAt: new Date() }])
      .set('tags.1.label', 'Updated Tag #2')
      .set('coordinates.1', 123.456)
      .build();

    console.info(JSON.stringify(result, null, 2));
  });

  it('should merge', () => {
    const initialData: DeepPartial<MockData> = {
      id: '123',
      user: {
        id: 456,
        name: 'Ken',
      },
    };
    const userToMerge: DeepPartial<User> = {
      name: 'Kenny',
      email: 'kenny@kentest.com',
      roles: ['admin'],
    };

    const builder = createPathBuilder(initialData)
      .merge('user', userToMerge)
      .set('tags', [{ id: 't1', label: 'Tag #1', createdAt: new Date() }]);

    const result = builder.build();
    console.info(JSON.stringify(result, null, 2));
  });

  it('should remove', () => {
    const initialData: DeepPartial<MockData> = {
      id: '123',
      user: {
        id: 456,
        name: 'Ken',
        email: 'kenny@kentest.com',
        roles: ['admin', 'editor'],
      },
      tags: [
        { id: 't1', label: 'Tag #1', createdAt: new Date() },
        { id: 't2', label: 'Tag #2', createdAt: new Date() },
      ],
    };

    const builder = createPathBuilder(initialData).remove('user.roles.0');

    const result = builder.build();
    console.info(JSON.stringify(result, null, 2));
  });
});
