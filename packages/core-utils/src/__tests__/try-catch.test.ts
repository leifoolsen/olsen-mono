import { describe, expect, it, test } from 'vitest';
import { tryCatch, tryCatchAsync } from '../try-catch';

describe('tryCatch', () => {
  const getData = (id?: number) => {
    if (!id) {
      throw new Error('No id found');
    }
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((i) => i % id);
  };

  const getAsyncData = async (id?: number) => {
    if (!id) {
      throw new Error('No id found');
    }
    return Promise.resolve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter((i) => i % id));
  };

  describe('tryCatch synchronous', () => {
    it('should succeed, fn()', () => {
      const success = () => 'Success';
      const [err, data] = tryCatch(() => success());
      expect(err).toBeUndefined();
      expect(data).toBe('Success');
    });

    it('should fail', () => {
      const fail = () => {
        throw new Error('Fail');
      };
      const [err, data] = tryCatch(() => fail());
      expect(err).toBeInstanceOf(Error);
      expect(data).toBeUndefined();
    });

    it('should succeed or fail', () => {
      const [noErr, success] = tryCatch<number[]>(() => getData(2));
      expect(noErr).toBeUndefined();
      expect(success).toEqual([1, 3, 5, 7, 9]);

      const [err, noData] = tryCatch(() => getData());
      expect(err).toBeInstanceOf(Error);
      expect(noData).toBeUndefined();
    });
  });

  describe('tryCatchAsync', () => {
    it('should succeed', async () => {
      const success = async () => Promise.resolve('Success');
      const [err, data] = await tryCatchAsync<string>(() => success());
      expect(err).toBeUndefined();
      expect(data).toBe('Success');
    });

    it('should fail', async () => {
      const fail = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        throw new Error('Fail');
      };
      const [err, data] = await tryCatchAsync<string>(() => fail());
      expect(err).toBeInstanceOf(Error);
      expect(data).toBeUndefined();
    });
  });

  describe('tryCatchAsync, promise like', () => {
    it('should succeed or fail', async () => {
      const [noErr, data] = await tryCatchAsync<number[]>(() => getAsyncData(2));
      expect(noErr).toBeUndefined();
      expect(data).toEqual([1, 3, 5, 7, 9]);

      const [err, noData] = await tryCatchAsync(() => getAsyncData());
      expect(err).toBeInstanceOf(Error);
      expect(noData).toBeUndefined();
    });
  });

  describe('tryCatch, edge cases', () => {
    test('throws synchronous error before a promise is returned', async () => {
      const fn = (flag: boolean) => {
        if (flag) throw new Error('Synchronous exception thrown outside Promise.resolve');
        return Promise.resolve('suksess');
      };

      const resultPromise = tryCatchAsync(() => fn(true));

      // biome-ignore lint/suspicious/noExplicitAny: any is ok for tests
      expect(typeof (resultPromise as any).then).toBe('function');

      const [err] = await resultPromise;
      expect(err?.message).toBe('Synchronous exception thrown outside Promise.resolve');
    });

    test('should work for both bound and unbound async function', async () => {
      const arrowAsync = async () => 'arrow';
      async function normalAsync() {
        return 'normal';
      }

      const [_err1, res1] = await tryCatchAsync(arrowAsync);
      const [_err2, res2] = await tryCatchAsync(normalAsync);

      expect(res1).toBe('arrow');
      expect(res2).toBe('normal');
    });

    test('custom thenables', async () => {
      const thenable = {
        // biome-ignore lint/suspicious/noThenProperty: OK for tests
        // biome-ignore lint/suspicious/noExplicitAny: OK for tests
        then: (onFulfilled: any) => onFulfilled('custom-thenable'),
      };

      const result = tryCatchAsync(() => thenable);
      expect(typeof result.then).toBe('function');
      const [_err, data] = await result;
      expect(data).toBe('custom-thenable');
    });
  });
});
