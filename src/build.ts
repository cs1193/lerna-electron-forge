import path from 'path';

// import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';
import * as fse from 'fs-extra';

import { getElectronForgePackages, getLernaDependentsForApp } from './lerna';

let spinner: any;

async function parallelAppBuilds() {
  const electronForgePackages = await getElectronForgePackages();

  _.forEach(electronForgePackages, (efp) => {
    const packageName: string = path.basename(efp.name);
    copyPackageToLernaElectronForgeDirectory(packageName, efp.location);
    copyDependentPackagesToLernaElectronForgeDirectory(efp.name);
    // @ts-ignore
    buildApp(efp.name, efp.location);
  });
}

async function buildApp(appName: string, appPath: string) {
  const packageName: string = path.basename(appName);
  copyPackageToLernaElectronForgeDirectory(packageName, appPath);
  console.log(appName, appPath);
}

async function copyDependentPackagesToLernaElectronForgeDirectory(name: string) {
  const dependents = await getLernaDependentsForApp(name);
  console.log(dependents);
}

function copyPackageToLernaElectronForgeDirectory(packageName: string, pathToPackage: string) {
  try {
    const tmpDir = path.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
    fse.copySync(pathToPackage, tmpDir, {
      filter: (src) => {
        return src.indexOf('node_modules') === -1;
      }
    });
    return tmpDir;
  } catch(err) {
    console.error(err);
    return false;
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
