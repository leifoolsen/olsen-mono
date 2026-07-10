import { describe, expect, it } from 'vitest';
import { createSafeRegex } from '../create-safe-regex';

describe('create-safe-regex', () => {
  it('should create a safe regex', () => {
    const match = false;
    const regex = createSafeRegex({
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      pattern: `${match ? '[1-9]\\d*' : '{{value}}'} results for.*"?{{searchTerm}}"?`,
      flags: 'i',
      terms: {
        value: 99,
        searchTerm: 'lorem ipsum',
      },
    });
    expect(regex.toString()).toBe('/99 results for.*"?lorem ipsum"?/i');
  });

  it('should run without terms parameter', () => {
    const regex = createSafeRegex({
      pattern: '(abc)',
      flags: 'i',
    });
    expect(regex.toString()).toBe('/(abc)/i');
  });

  it('should run without flags parameter', () => {
    const regex = createSafeRegex({
      pattern: '(abc)',
    });
    expect(regex.toString()).toBe('/(abc)/');
  });

  it('should throw SyntaxError if the generated regular expression pattern is invalid', () => {
    expect(() =>
      createSafeRegex({
        pattern: "(abc {{test}} I'm missing a closing parenthesis",
        flags: 'i',
        terms: { test: 0 },
      }),
    ).toThrow(SyntaxError);
  });

  it('should throw SyntaxError if invalid flags are provided', () => {
    expect(() =>
      createSafeRegex({
        pattern: 'abc',
        flags: 'xyz',
      }),
    ).toThrow(SyntaxError);
  });

  it('should throw Error if some placeholders were not replaced', () => {
    expect(() =>
      createSafeRegex({
        pattern: "{{test}} I'm {{notReplaced}}",
        flags: 'i',
        // @ts-expect-error – Incomplete terms prop for testing purposes
        terms: { test: 0 },
      }),
    ).toThrow(Error);

    expect(() =>
      // @ts-expect-error – Incomplete terms prop for testing purposes
      createSafeRegex({
        pattern: "I'm {{notReplaced}}",
      }),
    ).toThrow(Error);
  });

  it('should handle special replacement patterns like $& and $1 literally in terms', () => {
    const regex = createSafeRegex({
      pattern: 'Amount: {{amount}}',
      terms: {
        amount: '$100 og $& og $1 tegn',
      },
    });
    expect(regex.toString()).toBe('/Amount: \\$100 og \\$& og \\$1 tegn/');
  });

  it('should treat regex metacharacters in terms literally', () => {
    const regex = createSafeRegex({
      pattern: 'Term: {{value}}',
      terms: {
        value: 'a.b*c+d?[test](group)|^$\\',
      },
    });
    expect(regex.toString()).toBe('/Term: a\\.b\\*c\\+d\\?\\[test\\]\\(group\\)\\|\\^\\$\\\\/');
  });

  it('should throw an error even if the placeholder is empty like {{}}', () => {
    expect(() =>
      createSafeRegex({
        pattern: 'Search for {{}}',
        // @ts-expect-error – Empty placeholders don't exist in the types, so we have to force it for the runtime test
        terms: {},
      }),
    ).toThrow(/Some placeholders were not replaced/);
  });

  it('should escape hyphens (-) to prevent range injection inside character classes', () => {
    const regex = createSafeRegex({
      pattern: '[{{allowedChars}}]',
      terms: {
        allowedChars: 'a-z',
      },
    });
    expect(regex.toString()).toBe('/[a\\-z]/');
  });
});
