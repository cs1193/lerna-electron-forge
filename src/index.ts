import chalk from "chalk";
import * as _ from 'lodash';

import { getPackages } from '@lerna/project';

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

  getPackages()
    .then((packages: any) => {
      _.forEach(packages, (pkg: any, index: number) => {
        const devDependencies = _.keys(pkg.devDependencies);
        if (_.includes(devDependencies, '@electron-forge/cli')) {
          console.log(pkg.name, index);
        }
      });
    })
    .catch((error: any) => {
      console.error(
        chalk.red(error)
      );
    });
}
