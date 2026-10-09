import { describe, expect, it } from 'vitest';
import { injectForAttribute } from '../utils.ts';

describe('utils', () => {
  describe('injectForAttribute', () => {
    it('should inject correct for= if for= is not present', () => {
      const result = injectForAttribute('<label>Hello</label>', 'test-id');
      expect(result).toBe('<label for="test-id">Hello</label>');
    });

    it('should skip inject for= if already have for=', () => {
      const result = injectForAttribute('<label for="abc">Hello</label>', 'test-id');
      expect(result).toBe('<label for="abc">Hello</label>');
    });
  });
});
