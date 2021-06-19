import path from 'path';

import chalk from "chalk";
import * as _ from 'lodash';

import { getPackages } from '@lerna/project';
import { api } from '@electron-forge/core';

import {
  symlinkNodeModules,
  createTmpDirectory,
  copyPackageToTmpDirectory,
  cleanTmpDirectory,
  buildYarnPackage,
  createTmpPackagesDir,
  copyTarballsToTmpDir
} from './buildPackage';

export async function run() {
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

  cleanTmpDirectory();

  createTmpDirectory();

  const nonElectronForgePackages: any = [];

  getPackages()
    .then((packages: any) => {
      _.forEach(packages, (pkg: any/*, index: number*/) => {
        // buildYarnPackage(pkg.location);

        const devDependencies = _.keys(pkg.devDependencies);
        if (_.includes(devDependencies, '@electron-forge/cli')) {
          const packageName = path.basename(pkg.location);
          copyPackageToTmpDirectory(packageName, pkg.location);
          symlinkNodeModules(packageName);
          api.make({
            dir: path.join(process.cwd(), `.tmp/${packageName}`),
            outDir: path.join(process.cwd(), `.tmp/${packageName}/target`)
          });
        }

        if (!_.includes(devDependencies, '@electron-forge/cli')) {
          nonElectronForgePackages.push(pkg.location);
        }
      });

      createTmpPackagesDir();

      _.map(nonElectronForgePackages, (npe: any) => {
        buildYarnPackage(npe);
        copyTarballsToTmpDir(npe);
      });

    })
    .catch((error: any) => {
      console.error(
        chalk.red(error)
      );
    });
}
