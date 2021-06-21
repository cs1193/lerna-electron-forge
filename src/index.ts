import path from 'path';

import chalk from "chalk";
import * as _ from 'lodash';
import ora from 'ora';

import { getPackages } from '@lerna/project';

import {
  symlinkNodeModules,
  createTmpDirectory,
  copyPackageToTmpDirectory,
  cleanTmpDirectory,
  buildYarnPackage,
  createTmpPackagesDir,
  copyTarballsToTmpDir,
  installYarnPackage,
  installOtherPackagesToForgePackage,
  makeForgePackage,
  lernaBootstrap,
  lernaBuildPackages,
  readForgeConfigFile
} from './buildPackage';

export async function run() {
  try {
    const spinner = ora('Building Package')
      .start();

    spinner.text = 'Cleaning Temporary Directory';
    cleanTmpDirectory();
    spinner.succeed('Clean complete');

    spinner.text = 'Create Temporary Directory';
    createTmpDirectory();
    createTmpPackagesDir();
    spinner.succeed('Temporary Directory created');

    spinner.text = 'Reading Packages';
    const packages = await getPackages();
    spinner.succeed('Package read complete');

    spinner.text = 'Bootstrap Packages';
    lernaBootstrap();
    spinner.succeed('Packages bootstrapped');

    spinner.text = 'Build Packages';
    lernaBuildPackages();
    spinner.succeed('Packages built');

    spinner.text = 'Filtering Packages';
    const otherPackages: any[] = _.filter(packages, (pkg: any) => !_.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    const electronForgePackages: any[] = _.filter(packages, (pkg: any) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    spinner.succeed('Package filtered complete');

    spinner.text = 'Build Other Packages';
    // @ts-ignore
    const otherPackagesTmpPaths = _.map(otherPackages, (pkg: any) => {
      spinner.text = 'Building Yarn Package';
      buildYarnPackage(pkg.location);
      const packageName = path.basename(pkg.location);
      copyPackageToTmpDirectory(packageName, pkg.location);
      spinner.text = 'Copying Tarballs to .tmp Directory';
      return copyTarballsToTmpDir(pkg.location);
    });
    spinner.succeed('Other package build complete');

    spinner.text = 'Copy electron-forge packages to .tmp directory';
    const electronForgePackagePaths = _.map(electronForgePackages, (pkg: any) => {
      const packageName = path.basename(pkg.location);
      spinner.text = `Copying ${pkg.name} to .tmp directory`;
      const forgePackage = copyPackageToTmpDirectory(packageName, pkg.location);
      spinner.text = `Symlinking the root <node_modules> to ${pkg.name} node_modules`;
      symlinkNodeModules(packageName);
      return forgePackage;
    });
    spinner.succeed('Copied package to tmp');

    spinner.text = 'Build the electron-forge packages';
    _.forEach(electronForgePackagePaths, (pkgPath: any) => {
      spinner.text = `Installing yarn on ${pkgPath}`;
      installYarnPackage(pkgPath);
      spinner.text = `Installing the tarballs on ${pkgPath}`;
      installOtherPackagesToForgePackage(pkgPath);
    });
    spinner.succeed('Built electron-forge packages');

    spinner.text = 'Make electron-forge';
    _.forEach(electronForgePackagePaths, (pkgPath: any) => {
      spinner.text = `Reading forge.config.js on ${pkgPath}`;
      readForgeConfigFile(pkgPath);
      spinner.succeed(`Reading forge.config.js on ${pkgPath}`);
      spinner.text = `Making forge package on ${pkgPath}`;
      makeForgePackage(pkgPath);
      spinner.succeed(`Making forge package on ${pkgPath}`);
    });
    spinner.succeed('Make electron-forge complete');

    spinner.stop();
  } catch(e) {
    console.error(
      chalk.red(e)
    );
  }
}
