import * as _ from 'lodash';
import ora from 'ora';
import spawn from 'cross-spawn';
import { api } from '@electron-forge/core';

import { getElectronForgePackages } from './lerna';

let spinner: any;

async function parallelAppBuilds() {
  try {
    lernaBootstrap();

    const electronForgePackages = await getElectronForgePackages();

    _.forEach(electronForgePackages, (efp) => {
      buildApp(efp.name, efp.location);
    });
  } catch (e) {
    console.error(e);
  }
}

// @ts-ignore
async function buildApp(appName: string, appPath: string) {
  try {
    api.make({
      dir: appPath
    });
  } catch(err) {
    console.error(err);
  }
}

function lernaBootstrap() {
  try {
    spawn.sync('lerna', ['bootstrap']);
  } catch(err) {
    console.error(err);
  }
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
