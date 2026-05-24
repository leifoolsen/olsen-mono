import { execSync } from 'child_process';
import type { PlopTypes } from '@turbo/gen';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('package', {
    description: 'Generates a new minimal package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Package name? (e.g. "math-utils")',
        validate: (input: string) => {
          if (input.trim().length === 0) {
            return 'Package name cannot be empty.';
          }
          if (!/^[a-z0-9-]+$/.test(input)) {
            return 'Package name must be lowercase and can only contain letters, numbers, and dashes.';
          }
          return true;
        },
      },
      {
        type: 'input',
        name: 'description',
        message: 'Package description? (e.g. "Math utilities"):',
        validate: (input: string) => {
          if (input.trim().length === 0) {
            return 'Description cannot be empty.';
          }
          return true;
        },
      },
    ],
    actions: () => {
      const actionsList: PlopTypes.Actions = [
        {
          type: 'add',
          path: 'packages/{{dashCase name}}/package.json',
          templateFile: 'templates/package/package.json',
        },
        {
          type: 'add',
          path: 'packages/{{dashCase name}}/tsconfig.json',
          templateFile: 'templates/package/tsconfig.json',
        },
        {
          type: 'add',
          path: 'packages/{{dashCase name}}/README.md',
          templateFile: 'templates/package/README.md',
        },
        {
          type: 'add',
          path: 'packages/{{dashCase name}}/src/index.ts',
          templateFile: 'templates/package/src/index.ts',
        },
        {
          type: 'add',
          path: 'packages/{{dashCase name}}/src/__tests__/index.test.ts',
          templateFile: 'templates/package/src/__tests__/index.test.ts',
        },
      ];

      actionsList.push(() => {
        try {
          console.info('\n📦 Running pnpm install to link the new package...');
          execSync('pnpm install', { stdio: 'inherit' });
          return 'pnpm install completed successfully.';
        } catch (error) {
          throw new Error(`Failed to run pnpm install: ${Error.isError(error) ? error.message : (error as string)}`, {
            cause: error,
          });
        }
      });

      return actionsList;
    },
  });
}
