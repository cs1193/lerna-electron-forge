import CliTable3 from 'cli-table3';
import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';

import { getElectronForgePackages, isLernaMonorepo } from './lerna';

let spinner: any;

async function listElectronForgePackages() {
  spinner.text = 'Check if electron-forge packages are existing in lerna packages.';
  const electronForgePackages = await getElectronForgePackages();
  const table = new CliTable3({
    head: ['package name', 'path']
  });

  const tableData = _.map(electronForgePackages, (efp: any) => {
    return [efp.name, efp.location];
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

export function listCommand() {
  return {
    command: 'list',
    describe: 'To list electron-forge packages on lerna monorepo',
    handler: () => {
      spinner = ora('Init').start();
      if (isLernaMonorepo()) {
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
