import { readdirSync } from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vitest/config';

const packageDirs = readdirSync(path.resolve(__dirname, 'packages'));
const packageAliases = packageDirs.reduce<Record<string, string>>((acc, dir) => {
  acc[`@olsen-mono/${dir}`] = path.resolve(__dirname, `packages/${dir}/src/index.ts`);
  return acc;
}, {});

export default defineConfig({
  test: {
    alias: packageAliases,
    environment: 'happy-dom', // or 'jsdom'
    globals: true,
    setupFiles: [path.resolve(__dirname, './vitest-setup.ts')],
  },
});

// import path from 'node:path';
// import { defineConfig } from 'vitest/config';
//
// export default defineConfig({
//   plugins: [],
//   test: {
//     alias: {
//       '@olsen-mono/core-utils': path.resolve(__dirname, './packages/core-utils/src/index.ts'),
//     },
//     environment: 'happy-dom', // or 'jsdom'
//     globals: true,
//     setupFiles: [path.resolve(__dirname, './vitest-setup.ts')],
//   },
// });
