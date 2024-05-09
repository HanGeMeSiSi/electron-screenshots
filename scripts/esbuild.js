// Copyright 2022 Signal Messenger, LLC
// SPDX-License-Identifier: AGPL-3.0-only

const esbuild = require('esbuild');
const path = require('path');
const glob = require('glob');

const ROOT_DIR = path.join(__dirname, '..');

const watch = process.argv.some(argv => argv === '-w' || argv === '--watch');
const isProd = process.argv.some(argv => argv === '-prod' || argv === '--prod');

const nodeDefaults = {
  platform: 'node',
  target: 'es2020',
  sourcemap: isProd ? false : 'inline',
  // Otherwise React components get renamed
  // See: https://github.com/evanw/esbuild/issues/1147
  keepNames: true,
  logLevel: 'info',
  watch,
};

const bundleDefaults = {
  ...nodeDefaults,
  define: {
    'process.env.NODE_ENV': isProd ? '"production"' : '"development"',
  },
  bundle: true,
  external: [
    'packages',
  ],
};

const inputFiles1 = glob.sync('app/**/*.{ts,tsx}', {
  nodir: true,
  root: ROOT_DIR,
}).filter(file => !file.endsWith('.d.ts'));
const inputFiles2 = glob.sync('ts/**/*.{ts,tsx}', {
  nodir: true,
  root: ROOT_DIR,
}).filter(file => !file.endsWith('.d.ts'));

const inputFiles = [...inputFiles1, ...inputFiles2];
inputFiles.map(inputFile => {
  // 确定输出文件的路径，保持相对路径不变，只修改文件扩展名为 .js
  const outputFile = inputFile.replace(/\.(ts|tsx)$/, '.js');

  return esbuild.build({
    ...nodeDefaults,
    format: 'cjs',
    mainFields: ['browser', 'main'],
    entryPoints: [inputFile],
    outfile: path.join(ROOT_DIR, outputFile), // 设置输出文件路径
  });
});
