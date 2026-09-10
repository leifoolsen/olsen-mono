#!/usr/bin/env node

import { watch } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const isWatchMode = process.argv.includes('--watch') || process.argv.includes('-w');
const useCamelCase = process.argv.includes('--camelCase');
const args = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));

const [inputPath, outputPath] = args;

if (!inputPath) {
  console.error('❌ Missing argument! Usage: css-to-dts <source-dir> [target-dir] [--watch]');
  process.exit(1);
}

const absoluteInput = path.resolve(process.cwd(), inputPath);
const absoluteSourceDir = inputPath.endsWith('.css') ? path.dirname(absoluteInput) : absoluteInput;
const absoluteTargetDir = outputPath ? path.resolve(process.cwd(), outputPath) : null;

function toCamelCase(str: string): string {
  return str.replace(/-([a-z0-9])/g, (_, g) => g.toUpperCase());
}

function extractCssTokens(cssContent: string) {
  const cleanContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import\s+[^;]+;/g, '');

  // 1. Variables
  const variableRegex = /(--[a-zA-Z0-9_-]+)\s*:/g;
  const rawVariables = new Set<string>();
  for (const match of cleanContent.matchAll(variableRegex)) {
    if (match[1]) rawVariables.add(match[1]);
  }

  // 2. Classes
  const classRegex = /(?:\.([a-zA-Z_][a-zA-Z0-9_-]*)|&\.([a-zA-Z0-9_-]+))\b/g;
  const rawClasses = new Set<string>();
  for (const match of cleanContent.matchAll(classRegex)) {
    const className = match[1] || match[2];
    if (className) rawClasses.add(className);
  }

  // 3. Data attributes and related value
  const dataAttrRegex = /\[\s*(data-[a-zA-Z0-9_-]+)(?:\s*=\s*["']([^"']+)["'])?\s*\]/g;
  const dataAttributesMap: Record<string, Set<string>> = {};

  for (const match of cleanContent.matchAll(dataAttrRegex)) {
    const [_, attrName, attrValue] = match;
    if (attrName) {
      if (!dataAttributesMap[attrName]) {
        dataAttributesMap[attrName] = new Set<string>();
      }
      if (attrValue) {
        dataAttributesMap[attrName].add(attrValue);
      }
    }
  }

  // Filtering
  const filteredVariables = Array.from(rawVariables)
    .filter((variable) => !variable.startsWith('--_'))
    .sort();

  const filteredClasses = Array.from(rawClasses)
    .map((className) => (useCamelCase ? toCamelCase(className) : className))
    .sort();

  const formattedDataAttrs: Record<string, string[]> = {};
  for (const [attrName, valueSet] of Object.entries(dataAttributesMap)) {
    formattedDataAttrs[attrName] = Array.from(valueSet).sort();
  }

  return {
    classes: filteredClasses,
    variables: filteredVariables,
    dataAttributes: formattedDataAttrs,
  };
}

async function processSingleFile(cssFile: string): Promise<boolean> {
  try {
    const rawContent = await fs.readFile(cssFile, 'utf-8');
    const cssContent = rawContent.replace(/\r\n/g, '\n');

    const { classes, variables, dataAttributes } = extractCssTokens(cssContent);

    if (classes.length === 0 && variables.length === 0 && Object.keys(dataAttributes).length === 0) {
      return false;
    }

    const classUnion = classes.length > 0 ? classes.map((c) => `'${c}'`).join(' | ') : 'never';
    const variableUnion = variables.length > 0 ? variables.map((v) => `'${v}'`).join(' | ') : 'never';

    const dataTypesBlocks: string[] = [];
    const globalDataAttrTypePairs: string[] = [];

    for (const [attrName, values] of Object.entries(dataAttributes)) {
      const pascalName = attrName
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\s+/g, '');

      const valueUnion = values.length > 0 ? values.map((v) => `'${v}'`).join(' | ') : 'string';

      dataTypesBlocks.push(`export type ${pascalName} = ${valueUnion};`);
      globalDataAttrTypePairs.push(`  '${attrName}': ${pascalName};`);
    }

    const globalDataType =
      globalDataAttrTypePairs.length > 0
        ? `export type CssDataAttributes = {\n${globalDataAttrTypePairs.join('\n')}\n};`
        : `export type CssDataAttributes = never;`;

    const defaultExportType =
      classes.length > 0 ? `{\n${classes.map((c) => `  '${c}': string;`).join('\n')}\n}` : 'string';

    const typeDefinition = `${[
      `export type Css = ${classUnion};`,
      `export type CssVariables = ${variableUnion};`,
      ...dataTypesBlocks,
      globalDataType,
      `declare const styles: ${defaultExportType};`, // <-- Endret fra 'string' til det dynamiske objektet
      `export default styles;`,
    ].join('\n')}\n`;

    const sourceDtsFilePath = `${cssFile}.d.ts`;
    await fs.writeFile(sourceDtsFilePath, typeDefinition, 'utf-8');

    if (absoluteTargetDir) {
      const relativeDtsPath = path.relative(absoluteSourceDir, sourceDtsFilePath);
      const targetDtsFilePath = path.resolve(absoluteTargetDir, relativeDtsPath);
      await fs.mkdir(path.dirname(targetDtsFilePath), { recursive: true });
      await fs.copyFile(sourceDtsFilePath, targetDtsFilePath);
    }

    return true;
  } catch (error) {
    console.error(`⚠️ Failed to process file ${cssFile}:`, error);
    return false;
  }
}

async function scanAndProcess() {
  const relativeEntries = await fs.readdir(absoluteSourceDir, { recursive: true });
  const cssFiles = new Set<string>();
  const dtsFiles: string[] = [];

  for (const relativeEntry of relativeEntries) {
    if (relativeEntry.includes('node_modules') || relativeEntry.includes('.git')) continue;

    const entry = path.resolve(absoluteSourceDir, relativeEntry);
    if (!entry.endsWith('.css') && !entry.endsWith('.css.d.ts')) continue;

    const entryStat = await fs.stat(entry).catch(() => null);
    if (!entryStat?.isFile()) continue;

    if (entry.endsWith('.css.d.ts')) dtsFiles.push(entry);
    else if (entry.endsWith('.css')) cssFiles.add(entry);
  }

  let deletedCount = 0;
  const deletePromises = dtsFiles.map(async (dtsFile) => {
    const expectedCssFile = dtsFile.slice(0, -5);
    if (!cssFiles.has(expectedCssFile)) {
      await fs.unlink(dtsFile).catch(() => null);
      if (absoluteTargetDir) {
        const relativeToSource = path.relative(absoluteSourceDir, dtsFile);
        await fs.unlink(path.resolve(absoluteTargetDir, relativeToSource)).catch(() => null);
      }
      deletedCount++;
    }
  });

  await Promise.all(deletePromises);

  const processPromises = Array.from(cssFiles).map((file) => processSingleFile(file));
  const results = await Promise.all(processPromises);
  const generatedCount = results.filter(Boolean).length;

  return { generatedCount, deletedCount, cssFilesCount: cssFiles.size };
}

async function run() {
  try {
    const stat = await fs.stat(absoluteInput).catch(() => null);
    if (!stat) {
      console.error(`❌ Path does not exist: ${absoluteInput}`);
      process.exit(1);
    }

    if (stat.isFile()) {
      if (absoluteInput.endsWith('.css')) {
        const success = await processSingleFile(absoluteInput);
        if (success) console.info(`✨ Updated: ${path.relative(process.cwd(), absoluteInput)}.d.ts`);
      }
      return;
    }

    const initial = await scanAndProcess();
    console.info(`ℹ️ Found ${initial.cssFilesCount} CSS-file(s) at: ${absoluteInput}`);
    console.info(`🚀 Completed! Generated: ${initial.generatedCount} | Removed: ${initial.deletedCount}`);

    if (!isWatchMode) {
      process.exit(0);
    }

    console.info(`👀 Watching for CSS changes in ${path.relative(process.cwd(), absoluteSourceDir)}...`);

    // Debounce map - Prevents rapid re-processing of the same file
    const debounceTimers = new Map<string, NodeJS.Timeout>();

    watch(absoluteSourceDir, { recursive: true }, async (_eventType, filename) => {
      if (!filename?.endsWith('.css') || filename.endsWith('.css.d.ts')) return;

      const fullPath = path.resolve(absoluteSourceDir, filename);

      const existingTimer = debounceTimers.get(fullPath);
      if (existingTimer) clearTimeout(existingTimer);

      const timer = setTimeout(async () => {
        debounceTimers.delete(fullPath);

        const fileExists = await fs
          .stat(fullPath)
          .then(() => true)
          .catch(() => false);

        if (!fileExists) {
          const sync = await scanAndProcess();
          if (sync.deletedCount > 0) {
            console.info(`🗑️ CSS file deleted, removed orphaned .d.ts files.`);
          }
        } else {
          const success = await processSingleFile(fullPath);
          if (success) {
            console.info(`✨ Updated: ${path.relative(process.cwd(), fullPath)}.d.ts`);
          }
        }
      }, 100);

      debounceTimers.set(fullPath, timer);
    });

    await new Promise(() => {});
  } catch (error) {
    console.error(`❌ Error:`, error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

run().catch((err: unknown) => {
  console.error('❌ Fatal:', err);
  process.exit(1);
});
