// import chalk from 'chalk';
// import * as _ from 'lodash';
import ora from 'ora';

let spinner: any;

export function buildCommand() {
  return {
    command: 'build',
    describe: 'To build electron-forge app',
    handler: () => {
      spinner = ora('Build').start();
      console.log('build')
      spinner.stop();
    },
  }
}
