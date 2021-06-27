import path from 'path';
import * as fs from 'fs';

import CliTable3 from 'cli-table3';
import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';

import { getElectronForgePackages, isLernaMonorepo } from './lernaData';

let spinner: any;

function appendLernaElectroForgeToGitignore() {
  spinner.text = 'Adding cache directory to gitignore.';
  const rootDir = path.resolve(process.cwd());
  const gitignoreFile = path.join(rootDir, '.gitignore');

  const gitignoreData: string = `\n// .lerna-electron-forge gitignore. DO NOT REMOVE.\n.lerna-electron-forge`;

  fs.existsSync(gitignoreFile) && fs.appendFileSync(gitignoreFile, gitignoreData);

  spinner.succeed('Cache directory addition is complete.');
}

function createLernaElectronForgeDirectory() {
  spinner.text = 'Create .lerna-electron-forge cache directory on <rootDir>.';
  const rootDir = path.resolve(process.cwd());
  const lernaElectronForgeDirectory = path.join(rootDir, '.lerna-electron-forge');

  !fs.existsSync(lernaElectronForgeDirectory) && fs.mkdirSync(lernaElectronForgeDirectory);
  spinner.succeed('Create directory is complete.');
}

async function listElectronForgePackages() {
  spinner.text = 'Check if electron-forge packages are existing in lerna packages.';
  const electronForgePackages = await getElectronForgePackages();
  const table = new CliTable3({
    head: ['package name', 'path']
  });

  const tableData = _.map(electronForgePackages, (efp: any) => {
    return [efp.name, efp.path];
  });

  _.forEach(tableData, (td) => {
    table.push(
      td
    );
  });

  console.log(
    chalk.red('List Electron Forge Packages'),
    '\n'
  );

  console.log(
    table.toString()
  );

  spinner.succeed('Checking of electron-forge package is complete.');
}

export function initCommand() {
  return {
    command: 'init',
    describe: 'To provision electron-forge build on lerna monorepo',
    handler: () => {
      spinner = ora('Init').start();
      if (isLernaMonorepo()) {
        createLernaElectronForgeDirectory();
        appendLernaElectroForgeToGitignore();
        listElectronForgePackages();
      } else {
        console.error(
          chalk.red('This directory is not a Lerna Monorepo')
        );
      }
      spinner.stop();
    },
  }
}
