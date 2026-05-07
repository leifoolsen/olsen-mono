import { describe, expect, it } from 'vitest';
import { tryCatch } from '../try-catch';

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

  describe('tryCatch asynchronous', () => {
    it('should succeed', async () => {
      const success = async () => Promise.resolve('Success');
      const [err, data] = await tryCatch<string>(() => success());
      expect(err).toBeUndefined();
      expect(data).toBe('Success');
    });

    it('should fail', async () => {
      const fail = async () => {
        await new Promise((resolve) => setTimeout(resolve, 1));
        throw new Error('Fail');
      };
      const [err, data] = await tryCatch<string>(() => fail());
      expect(err).toBeInstanceOf(Error);
      expect(data).toBeUndefined();
    });
  });

  describe('tryCatch promise like', () => {
    it('should succeed or fail', async () => {
      const [noErr, data] = await tryCatch<number[]>(getAsyncData(2));
      expect(noErr).toBeUndefined();
      expect(data).toEqual([1, 3, 5, 7, 9]);

      const [err, noData] = await tryCatch(getAsyncData());
      expect(err).toBeInstanceOf(Error);
      expect(noData).toBeUndefined();
    });
  });
});
