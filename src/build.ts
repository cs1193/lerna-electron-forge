import path from 'path';

// import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';
import * as fse from 'fs-extra';
import spawn from 'cross-spawn';
import glob from 'glob';
import { api } from '@electron-forge/core';

import { getElectronForgePackages, getLernaDependentsForApp } from './lerna';

let spinner: any;

async function parallelAppBuilds() {
  const electronForgePackages = await getElectronForgePackages();

  _.forEach(electronForgePackages, (efp) => {
    const packageName: string = path.basename(efp.location);
    copyPackageToLernaElectronForgeDirectory(packageName, efp.location);
    copyDependentPackagesToLernaElectronForgeDirectory(efp.name);
    installDependentTarballs(efp.name, packageName);
    installYarnPackage(packageName);
    buildApp(efp.name, efp.location);
  });
}

// @ts-ignore
async function buildApp(appName: string, appPath: string) {
  const packageName: string = path.basename(appPath);
  const tmpDir = path.join(process.cwd(), `.lerna-electron-forge/${packageName}`);

  try {
    api.make({
      dir: tmpDir
    });
  } catch(err) {
    console.error(err);
  }
}

async function copyDependentPackagesToLernaElectronForgeDirectory(name: string) {
  const dependents = await getLernaDependentsForApp(name);

  _.forEach(dependents, (dep: any) => {
    console.log(dep.name, dep.location);
    // const packageName: string = path.basename(dep.location);
    createTarballs(dep.location);
    copyTarballsToLernaElectronForgeDirectory(dep.location);
    // copyPackageToLernaElectronForgeDirectory(packageName, dep.location);
  });
}

function createTarballs(pathToPackage: string) {
  process.chdir(pathToPackage);
  spawn.sync('yarn', ['pack'])
  process.chdir('../../');
}

function copyTarballsToLernaElectronForgeDirectory(pathToPackage: string) {
  const tmpDir = path.join(process.cwd(), `.lerna-electron-forge`, `packages`);
  const tarballs = glob.sync(`${pathToPackage}/*.tgz`);
  return _.map(tarballs, (tarball: string) => {
    const filename = path.basename(tarball);
    const filepath = path.join(tmpDir, filename);
    fse.copySync(tarball, filepath);
    return filepath;
  });
}

async function installDependentTarballs(appName: string, packageName: string) {
  try {
    const tmpDir = path.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
    const tmpPackagesDir = path.join(process.cwd(), `.lerna-electron-forge`, `packages`);

    const dependents = await getLernaDependentsForApp(appName);

    process.chdir(tmpDir);

    _.forEach(dependents, (dep: any) => {
      const depPackageName = path.basename(dep.location);
      const tarballs = glob.sync(`${tmpPackagesDir}/${depPackageName}-*`);

      if (tarballs && tarballs.length > 0 && tarballs[0]) {
        spawn.sync('yarn', ['install', `${tarballs[0]}`]);
      }
    });

    process.chdir('../../');
  } catch(err) {
    console.error(err);
  }
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

function installYarnPackage(packageName: string) {
  const tmpDir = path.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
  process.chdir(tmpDir);
  spawn.sync('yarn');
  process.chdir('../../');
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
