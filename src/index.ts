import path from 'path';

import chalk from "chalk";
import * as _ from 'lodash';
import ora from 'ora';

import { getPackages } from '@lerna/project';
// import { api } from '@electron-forge/core';

import {
  symlinkNodeModules,
  createTmpDirectory,
  copyPackageToTmpDirectory,
  cleanTmpDirectory,
  buildYarnPackage,
  createTmpPackagesDir,
  copyTarballsToTmpDir,
  installYarnPackage,
  installOtherPackagesToForgePackage
} from './buildPackage';

export async function run() {
  try {
    const spinner = ora('Building Package').start();

    // const yargs = require('yargs');

    // const argv = yargs
    //   .usage('lerna-electron-forge [options]')
    //   .options({
    //     list: {
    //       type: "boolean"
    //     },
    //     build: {
    //       type: "string"
    //     }
    //   })
    //   .example(
    //     "lerna-electron-forge build"
    //   )
    //   .epilog("For more information, see https://github.com/cs1193/lerna-electron-forge")
    //   .argv;

    spinner.text = 'Cleaning Temporary Directory';
    cleanTmpDirectory();

    spinner.text = 'Create Temporary Directory';
    createTmpDirectory();
    createTmpPackagesDir();

    spinner.text = 'Reading Packages';
    const packages = await getPackages();
    spinner.succeed('Package read complete');

    spinner.text = 'Filtering Packages';
    const otherPackages: any[] = _.filter(packages, (pkg: any) => !_.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    const electronForgePackages: any[] = _.filter(packages, (pkg: any) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    spinner.succeed('Package filtered complete');

    spinner.text = 'Build Other Packages';
    // @ts-ignore
    const otherPackagesTmpPaths = _.map(otherPackages, (pkg: any) => {
      buildYarnPackage(pkg.location);
      return copyTarballsToTmpDir(pkg.location);
    });
    spinner.succeed('Other package build complete');

    spinner.text = 'Copy electron-forge packages to tmp';
    const electronForgePackagePaths = _.map(electronForgePackages, (pkg: any) => {
      const packageName = path.basename(pkg.location);
      const forgePackage = copyPackageToTmpDirectory(packageName, pkg.location);
      symlinkNodeModules(packageName);
      return forgePackage;
    });
    spinner.succeed('Copied package to tmp');

    spinner.text = 'Build the electron-forge packages';
    _.forEach(electronForgePackagePaths, (pkgPath: any) => {
      installYarnPackage(pkgPath);
      installOtherPackagesToForgePackage(pkgPath);
    });
    spinner.succeed('Built electron-forge packages');

    spinner.stop();

    // getPackages()
    //   .then((packages: any) => {
    //     _.forEach(packages, (pkg: any/*, index: number*/) => {
    //       // buildYarnPackage(pkg.location);

    //       const devDependencies = _.keys(pkg.devDependencies);
    //       if (_.includes(devDependencies, '@electron-forge/cli')) {
    //         const packageName = path.basename(pkg.location);
    //         copyPackageToTmpDirectory(packageName, pkg.location);
    //         symlinkNodeModules(packageName);
    //         api.make({
    //           dir: path.join(process.cwd(), `.tmp/${packageName}`),
    //           outDir: path.join(process.cwd(), `.tmp/${packageName}/target`)
    //         });
    //       }

    //       if (!_.includes(devDependencies, '@electron-forge/cli')) {
    //         nonElectronForgePackages.push(pkg.location);
    //       }
    //     });

    //     createTmpPackagesDir();

    //     _.map(nonElectronForgePackages, (npe: any) => {
    //       buildYarnPackage(npe);
    //       copyTarballsToTmpDir(npe);
    //     });

    //   })
    //   .catch((error: any) => {
    //     console.error(
    //       chalk.red(error)
    //     );
    //   });
  } catch(e) {
    console.error(
      chalk.red(e)
    );
  }
}
