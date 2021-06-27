import path from 'path';
import * as fs from 'fs';

import chalk from 'chalk';

function appendLernaElectroForgeToGitignore() {
  const rootDir = path.resolve(process.cwd());
  const gitignoreFile = path.join(rootDir, '.gitignore');

  const gitignoreData: string = `
    // .lerna-electron-forge gitignore. DO NOT REMOVE.
    .lerna-electron-forge
  `;

  fs.existsSync(gitignoreFile) && fs.appendFileSync(gitignoreFile, gitignoreData)
}

function createLernaElectronForgeDirectory() {
  const rootDir = path.resolve(process.cwd());
  const lernaElectronForgeDirectory = path.join(rootDir, '.lerna-electron-forge');

  fs.existsSync(lernaElectronForgeDirectory) && fs.mkdirSync(lernaElectronForgeDirectory);
}

function isLernaMonorepo() {
  const rootDir = path.resolve(process.cwd());
  const lernaConfigFile = path.join(rootDir, 'lerna.json');

  return fs.existsSync(lernaConfigFile)
}

export function initCommand() {
  return {
    command: 'init',
    describe: 'To provision electron-forge build on lerna monorepo',
    handler: () => {
      if (isLernaMonorepo()) {
        createLernaElectronForgeDirectory();
        appendLernaElectroForgeToGitignore();
      } else {
        console.error(
          chalk.red('This directory is not a Lerna Monorepo')
        );
      }
    },
  }
}
