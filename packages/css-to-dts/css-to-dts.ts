#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const [inputPath] = process.argv.slice(2);

if (!inputPath) {
  console.error('❌ Missing argument! Usage: node css-to-dts.ts <mappe>');
  process.exit(1);
}

const absoluteTargetDir = path.resolve(process.cwd(), inputPath);
console.info(`🔍 Scanning folder: ${absoluteTargetDir}`);

function extractCssTokens(cssContent: string) {
  const cleanContent = cssContent //
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/@import\s+[^;]+;/g, '');

  const variableRegex = /(--[a-zA-Z0-9_-]+)/g;
  const variables = new Set<string>();
  let varMatch;
  while ((varMatch = variableRegex.exec(cleanContent)) !== null) {
    if (varMatch[1]) variables.add(varMatch[1]);
  }

  const classRegex = /(?:\.([a-zA-Z_][a-zA-Z0-9_-]*)|&\.([a-zA-Z0-9_-]+))/g;
  const classNames = new Set<string>();
  let classMatch;

  while ((classMatch = classRegex.exec(cleanContent)) !== null) {
    const className = classMatch[1] || classMatch[2];
    if (className) {
      classNames.add(className);
    }
  }

  return {
    classes: Array.from(classNames).sort(),
    variables: Array.from(variables).sort(),
  };
}

async function run() {
  try {
    await fs.access(absoluteTargetDir);

    const relativeEntries = await fs.readdir(absoluteTargetDir, { recursive: true });

    const cssFiles = new Set<string>();
    const dtsFiles: string[] = [];

    for (const relativeEntry of relativeEntries) {
      const entry = path.resolve(absoluteTargetDir, relativeEntry);

      const stat = await fs.stat(entry).catch(() => null);
      if (!stat || !stat.isFile()) continue;

      if (entry.endsWith('.css.d.ts')) {
        dtsFiles.push(entry);
      } else if (entry.endsWith('.css')) {
        cssFiles.add(entry);
      }
    }

    console.info(`ℹ️ Found ${cssFiles.size} CSS-fils(s) and ${dtsFiles.length} existing .d.ts-file(s)`);

    let deletedCount = 0;
    for (const dtsFile of dtsFiles) {
      const expectedCssFile = dtsFile.slice(0, -5); // Fjerner ".d.ts"

      if (!cssFiles.has(expectedCssFile)) {
        await fs.unlink(dtsFile);
        console.info(`🗑️ Removing outdated file: ${path.relative(process.cwd(), dtsFile)}`);
        deletedCount++;
      }
    }

    let generatedCount = 0;
    for (const cssFile of cssFiles) {
      const cssContent = await fs.readFile(cssFile, 'utf-8');
      const { classes, variables } = extractCssTokens(cssContent);

      if (classes.length === 0 && variables.length === 0) {
        console.info(`⚠️ Skipping empty file: ${path.relative(process.cwd(), cssFile)}`);
        continue;
      }

      const classUnion = classes.length > 0 ? classes.map((c) => `'${c}'`).join(' | ') : 'never';
      const variableUnion = variables.length > 0 ? variables.map((v) => `'${v}'`).join(' | ') : 'never';

      const typeDefinition =
        [
          `export type Css = ${classUnion};`,
          `export type CssVariables = ${variableUnion};`,
          `declare const styles: string;`,
          `export default styles;`,
        ].join('\n') + '\n';

      const targetFilePath = `${cssFile}.d.ts`;
      await fs.writeFile(targetFilePath, typeDefinition, 'utf-8');

      console.info(`✨ Genererated: ${path.relative(process.cwd(), targetFilePath)}`);
      generatedCount++;
    }

    console.info(`\n🚀 Completed! Genererated: ${generatedCount} | Removed: ${deletedCount}`);
  } catch (error) {
    console.error(`❌ An error occured while processing:`, Error.isError(error) ? error.message : error);
    process.exit(1);
  }
}

if (process.argv[1] === import.meta.filename || process.argv[1]?.endsWith('css-to-dts.ts')) {
  await run();
}
