import { type DeepPartial } from '@olsen-mono/core-utils';
import { describe, expect, it } from 'vitest';
import { deepMerge } from '../deep-merge';

describe('deepMerge', () => {
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

  it('should deep merge two objects together', () => {
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

    const expected = {
      id: '123',
      user: {
        id: 456,
        name: 'Kenny',
        email: 'kenny@kentest.com',
        roles: ['admin'],
      },
    };

    deepMerge(initialData, { user: userToMerge });
    expect(initialData).toEqual(expected);
  });
});
