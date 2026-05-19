import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

try {
  // 1. Finn den nøyaktige plasseringen av htmx i node_modules
  const htmxAbsoluteMjsPath = require.resolve('htmx.org');
  const htmxDir = path.dirname(htmxAbsoluteMjsPath);
  const sourceFile = path.join(htmxDir, 'htmx.min.js');

  // 2. Definer målmappen i public
  const targetDir = path.resolve('public/js');
  const targetFile = path.join(targetDir, 'htmx.min.js');

  // 3. Sørg for at målmappen eksisterer, og kopier filen
  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(sourceFile, targetFile);

  console.info('✅ htmx.min.js ble automatisk kopiert til public/js/');
} catch (error) {
  console.error('❌ Klarte ikke å kopiere htmx:', error);
  process.exit(1);
}
