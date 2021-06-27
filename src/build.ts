
// import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';

import { getElectronForgePackages } from './lerna';


let spinner: any;

async function parallelAppBuilds() {
  const electronForgePackages = await getElectronForgePackages();

  _.map(electronForgePackages, (efp) => {
    // @ts-ignore
    buildApp(efp.name, efp.location);
  });
}

async function buildApp(appName: string, appPath: string) {
  console.log(appName, appPath);
}

export function buildCommand() {
  return {
    command: 'build',
    describe: 'To build electron-forge app',
    handler: () => {
      spinner = ora('Build').start();
      parallelAppBuilds();
      spinner.stop();
    },
  }
}
