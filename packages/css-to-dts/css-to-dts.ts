#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const [inputPath, outputPath] = args;

if (!inputPath) {
  console.error('❌ Missing argument! Usage: css-to-dts <source-dir> [target-dir]');
  process.exit(1);
}

const absoluteInput = path.resolve(process.cwd(), inputPath);
const absoluteSourceDir = inputPath.endsWith('.css') ? path.dirname(absoluteInput) : absoluteInput;
const absoluteTargetDir = outputPath ? path.resolve(process.cwd(), outputPath) : null;

function extractCssTokens(cssContent: string) {
  const cleanContent = cssContent.replace(/\/\*[\s\S]*?\*\//g, '').replace(/@import\s+[^;]+;/g, '');

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
    if (className) classNames.add(className);
  }

  return { classes: Array.from(classNames).sort(), variables: Array.from(variables).sort() };
}

async function processSingleFile(cssFile: string) {
  const cssContent = await fs.readFile(cssFile, 'utf-8');
  const { classes, variables } = extractCssTokens(cssContent);

  if (classes.length === 0 && variables.length === 0) {
    return false;
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

  const sourceDtsFilePath = `${cssFile}.d.ts`;
  await fs.writeFile(sourceDtsFilePath, typeDefinition, 'utf-8');

  if (absoluteTargetDir) {
    const relativeDtsPath = path.relative(absoluteSourceDir, sourceDtsFilePath);
    const targetDtsFilePath = path.resolve(absoluteTargetDir, relativeDtsPath);
    await fs.mkdir(path.dirname(targetDtsFilePath), { recursive: true });
    await fs.copyFile(sourceDtsFilePath, targetDtsFilePath);
  }

  return true;
}

async function run() {
  try {
    // console.info(`💼 Active Working Directory: ${process.cwd()}`);
    // console.info(`🔍 Input resolved to:       ${absoluteInput}`);
    // if (absoluteTargetDir) {
    //   console.info(`🎯 Target resolved to:      ${absoluteTargetDir}`);
    // }

    const stat = await fs.stat(absoluteInput).catch(() => null);
    if (!stat) {
      console.error(`❌ Path does not exist: ${absoluteInput}`);
      process.exit(1);
    }

    if (stat.isFile()) {
      if (absoluteInput.endsWith('.css')) {
        const success = await processSingleFile(absoluteInput);
        if (success) {
          console.info(`✨ Updated: ${path.relative(process.cwd(), absoluteInput)}.d.ts`);
        }
      }
      return;
    }

    const relativeEntries = await fs.readdir(absoluteSourceDir, { recursive: true });
    const cssFiles = new Set<string>();
    const dtsFiles: string[] = [];

    for (const relativeEntry of relativeEntries) {
      const entry = path.resolve(absoluteSourceDir, relativeEntry);
      const entryStat = await fs.stat(entry).catch(() => null);
      if (!entryStat || !entryStat.isFile()) continue;

      if (entry.endsWith('.css.d.ts')) dtsFiles.push(entry);
      else if (entry.endsWith('.css')) cssFiles.add(entry);
    }

    console.info(`ℹ️ Found ${cssFiles.size} CSS-file(s) at: ${absoluteInput}`);

    let deletedCount = 0;
    for (const dtsFile of dtsFiles) {
      const expectedCssFile = dtsFile.slice(0, -5);
      if (!cssFiles.has(expectedCssFile)) {
        await fs.unlink(dtsFile).catch(() => null);
        if (absoluteTargetDir) {
          const relativeToSource = path.relative(absoluteSourceDir, dtsFile);
          await fs.unlink(path.resolve(absoluteTargetDir, relativeToSource)).catch(() => null);
        }
        deletedCount++;
      }
    }

    let generatedCount = 0;
    for (const cssFile of cssFiles) {
      if (await processSingleFile(cssFile)) generatedCount++;
    }

    console.info(`🚀 Completed! Generated: ${generatedCount} | Removed: ${deletedCount}`);
  } catch (error) {
    console.error(`❌ Error:`, error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

await run();
