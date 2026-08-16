import { describe, expect, it } from 'vitest';

import { match, matchAsync } from '../match';

describe('match', () => {
  type Color = 'blue' | 'green' | 'red' | 'yellow';

  describe('match synchronous', () => {
    describe('match direct predicate', () => {
      it('match predicate', () => {
        const color = match<string, Color>('success')
          .on('warning', () => 'red')
          .on('success', () => 'green')
          .otherwise(() => 'blue');

        expect(color).toBe('green');
      });

      it('match boolean predicate', () => {
        const value = true;

        const color = match<boolean, string>(value)
          .on(value, () => 'red')
          .otherwise(() => 'blue');

        expect(color).toBe('red');

        // Simplified
        const color2 = match()
          .on(value, () => 'red')
          .otherwise(() => 'blue');

        expect(color2).toBe('red');
      });
    });

    it('should evaluate the first match when more then one predicate evaluates to the same value', () => {
      const color = match<string, Color>('warning')
        .on('warning', () => 'red')
        .on('warning', () => 'green')
        .otherwise(() => 'blue');

      expect(color).toBe('red');

      const value = true;
      const color2 = match<boolean, string>(value)
        .on(value, () => 'red')
        .on(value, () => 'green')
        .otherwise(() => 'blue');

      expect(color2).toBe('red');

      // Simplified
      const color3 = match()
        .on(value, () => 'red')
        .on(value, () => 'green')
        .otherwise(() => 'blue');

      expect(color3).toBe('red');
    });

    describe('match predicate function', () => {
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

      it('defaults when nothing matches', () => {
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
  });

  describe('match asynchronous', () => {
    describe('match direct predicate', () => {
      it('matchAsync predicate', async () => {
        type Status = 'idle' | 'loading' | 'success' | 'warning' | 'error';
        const status: Status = 'warning';

        const color = await matchAsync<Status, Color>(status)
          .on('success', () => 'green')
          .on('warning', () => 'yellow')
          .on('error', () => 'red')
          .otherwise(() => 'blue');

        expect(color).toBe('yellow');
      });

      it('matchAsync boolean predicate', async () => {
        const value = true;
        const color = await matchAsync<boolean, string>(value)
          .on(value, () => 'red')
          .otherwise(() => 'blue');

        expect(color).toBe('red');

        // Simplified
        const color2 = await matchAsync()
          .on(value, () => 'red')
          .otherwise(() => 'blue');

        expect(color2).toBe('red');
      });

      it('should evaluate the first match when more then one predicate evaluates to the same value', async () => {
        const color = await matchAsync<string, Color>('warning')
          .on('warning', () => 'red')
          .on('warning', () => 'green')
          .otherwise(() => 'blue');

        expect(color).toBe('red');

        const value = true;
        const color2 = await matchAsync<boolean, string>(value)
          .on(value, () => 'red')
          .on(value, () => 'green')
          .otherwise(() => 'blue');

        expect(color2).toBe('red');

        // Simplified
        const color3 = await matchAsync()
          .on(value, () => 'red')
          .on(value, () => 'green')
          .otherwise(() => 'blue');

        expect(color3).toBe('red');
      });
    });

    describe('match predicate function', () => {
      it('should match a primitive value using synchronous predicates', async () => {
        const color = await matchAsync<string, Color>('success')
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

      it('should match using an asynchronous predicate and asynchronous result', async () => {
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

        const color = await matchAsync<string, Color>('warning')
          .on(
            async (x) => {
              await delay(10);
              return x === 'warning';
            },
            async () => {
              await delay(10);
              return 'yellow' as const;
            },
          )
          .otherwise(() => 'blue');

        expect(color).toBe('yellow');
      });

      it('should fall back to otherwise when no conditions match', async () => {
        const color = await matchAsync<string, Color>('unknown-status')
          .on(
            (x) => x === 'success',
            () => 'green',
          )
          .otherwise(() => 'blue');

        expect(color).toBe('blue');
      });

      it('should evaluate raw boolean expressions instead of functions', async () => {
        const isSunny = true;
        const temperature = 25;

        const weatherReport = await matchAsync()
          .on(temperature > 30, () => 'Very hot')
          .on(isSunny, () => 'Nice and sunny')
          .otherwise(() => 'Cloudy');

        expect(weatherReport).toBe('Nice and sunny');
      });

      it('should handle complex objects and deep branching properly', async () => {
        type MatchObject = {
          result?: 'error' | 'success' | 'warning';
          secondArg?: boolean;
        };

        const color = await matchAsync<MatchObject, Color>({ result: 'error', secondArg: true })
          .on(
            ({ result, secondArg }) => result === 'warning' && secondArg === true,
            () => 'yellow',
          )
          .on(
            ({ result, secondArg }) => result === 'error' && secondArg === true,
            () => 'red',
          )
          .otherwise(() => 'blue');

        expect(color).toBe('red');
      });

      it('should correctly infer narrowing via custom type guards', async () => {
        type Dog = {
          type: 'dog';
          bark: () => string;
        };

        type Cat = {
          type: 'cat';
          meow: () => string;
        };

        type Animal = Dog | Cat;

        const myPet: Animal = { type: 'dog', bark: () => 'Woof!' };

        const sound = await matchAsync<Animal>(myPet)
          .on(
            (animal): animal is Dog => animal.type === 'dog',
            (dog) => dog.bark(),
          )
          .on(
            (animal): animal is Cat => animal.type === 'cat',
            (cat) => cat.meow(),
          )
          .otherwise(() => 'Silence');

        expect(sound).toBe('Woof!');
      });
    });
  });
});
