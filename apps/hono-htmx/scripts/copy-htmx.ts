import fs from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

try {
  const htmxAbsoluteMjsPath = require.resolve('htmx.org');
  const htmxDir = path.dirname(htmxAbsoluteMjsPath);
  const sourceFile = path.join(htmxDir, 'htmx.min.js');

  const targetDir = path.resolve('public/js');
  const targetFile = path.join(targetDir, 'htmx.min.js');

  await fs.mkdir(targetDir, { recursive: true });
  await fs.copyFile(sourceFile, targetFile);

  console.info('✅ htmx.min.js was copied to public/js/');
} catch (error) {
  console.error('❌ Failed to copy htmx.min.js:', error);
  process.exit(1);
}
