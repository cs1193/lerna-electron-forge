import path from 'path';

import chalk from "chalk";
import * as _ from 'lodash';

import { getPackages } from '@lerna/project';
// import { packDirectory } from '@lerna/pack-directory';
import { api } from '@electron-forge/core';

import {
  symlinkNodeModules,
  createTmpDirectory,
  copyPackageToTmpDirectory,
  cleanTmpDirectory
} from './buildPackage';

export async function run() {
  const yargs = require('yargs');

  const argv = yargs
    .usage('lerna-electron-forge [options]')
    .options({
      list: {
        type: "boolean"
      },
      build: {
        type: "string"
      }
    })
    .example(
      "lerna-electron-forge build"
    )
    .epilog("For more information, see https://github.com/cs1193/lerna-electron-forge")
    .argv;

  console.log(argv);

  cleanTmpDirectory();

  createTmpDirectory();

  getPackages()
    .then((packages: any) => {
      _.forEach(packages, (pkg: any, index: number) => {
        // packDirectory(pkg, pkg.location, {});

        const devDependencies = _.keys(pkg.devDependencies);
        if (_.includes(devDependencies, '@electron-forge/cli')) {
          const packageName = path.basename(pkg.location);
          copyPackageToTmpDirectory(packageName, pkg.location);
          console.log(packageName, index);
          symlinkNodeModules(packageName);
          api.make({
            dir: path.join(__dirname, `.tmp/${packageName}`)
          });
        }
      });
    })
    .catch((error: any) => {
      console.error(
        chalk.red(error)
      );
    });
}
