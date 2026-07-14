import { describe, expect, it } from 'vitest';

import { match } from '../match';

describe('match', () => {
  type Color = 'blue' | 'green' | 'red' | 'yellow';

  it('match', () => {
    const color: Color = match<string, Color>('success')
      .on(
        (x) => x === 'warning',
        () => 'red',
      )
      .on(
        (x) => x === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color).toBe('green');
  });

  it('defaults when nothing matches', () => {
    const color: Color = match<string, Color>('nothing')
      .on(
        (x) => x === 'warning',
        () => 'red',
      )
      .on(
        (x) => x === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color).toBe('blue');
  });

  it('throws when nothing matches', () => {
    expect(() => {
      match<string, Color>('nothing')
        .on(
          (x) => x === 'warning',
          () => 'red',
        )
        .on(
          (x) => x === 'success',
          () => 'green',
        )
        .otherwise(() => {
          throw new Error('No Match');
        });
    }).toThrow();
  });

  it('should not compile if match() is missing', () => {
    // @ts-expect-error - TS Error due to missing otherwise()
    const _color: Color = match<string, Color>('nothing').on(
      (x) => x === 'warning',
      () => 'red',
    );

    expect.assertions(0);
  });

  it('should throw error if otherwise() is missing', () => {
    const unclosedChain = match<string, Color>('success').on(
      (x) => x === 'success',
      () => 'green',
    );

    expect(() => {
      // @ts-expect-error required for testing
      const _forceStringConversion = `${unclosedChain}`;
    }).toThrow('Match must be terminated with .otherwise()');
  });

  it('match object', () => {
    type MatchObject = {
      result?: 'error' | 'success' | 'warning';
      secondArg?: boolean;
    };

    const color: Color = match<MatchObject, Color>({ result: 'error', secondArg: true })
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color).toBe('red');

    const color2: Color = match<MatchObject, Color>({ result: 'error', secondArg: false })
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color2).toBe('blue');

    const color3: Color = match<MatchObject, Color>({ result: 'warning', secondArg: true })
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color3).toBe('yellow');

    const color4: Color = match<MatchObject, Color>({ result: 'warning' })
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color4).toBe('blue');

    const color5: Color = match<MatchObject, Color>({ result: 'success' })
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color5).toBe('green');

    const color6: Color = match<MatchObject, Color>({})
      .on(
        ({ result, secondArg }) => result === 'warning' && secondArg === true,
        () => 'yellow',
      )
      .on(
        ({ result, secondArg }) => result === 'error' && secondArg === true,
        () => 'red',
      )
      .on(
        ({ result }) => result === 'success',
        () => 'green',
      )
      .otherwise(() => 'blue');

    expect(color6).toBe('blue');
  });
});
