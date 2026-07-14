import { describe, expect, it } from 'vitest';
import { match } from '../match';

describe('match', () => {
  type Color = 'blue' | 'green' | 'red' | 'yellow';

  it('match', () => {
    const color = match<string, Color>('success')
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

  it('otherwise', () => {
    const color = match<string, Color>('nothing')
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

  it('match object', () => {
    type MatchObject = {
      result?: 'error' | 'success' | 'warning';
      secondArg?: boolean;
    };

    const color = match<MatchObject, Color>({ result: 'error', secondArg: true })
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

    const color2 = match<MatchObject, Color>({ result: 'error', secondArg: false })
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

    const color3 = match<MatchObject, Color>({ result: 'warning', secondArg: true })
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

    const color4 = match<MatchObject, Color>({ result: 'warning' })
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

    const color5 = match<MatchObject, Color>({ result: 'success' })
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

    const color6 = match<MatchObject, Color>({})
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
