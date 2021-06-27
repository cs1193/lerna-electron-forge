import cluster from 'cluster';
import * as os from 'os';

import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';

import { getElectronForgePackages } from './lerna';

const CPUS = os.cpus().length;

let spinner: any;

async function parallelAppBuilds() {
  spinner.text = 'Parallelize app building..';
  const electronForgePackages = await getElectronForgePackages();
  const apps = _.map(electronForgePackages, (efp) => {
    return efp.name
  });

  if (cluster.isMaster) {
    console.log(
      chalk.yellow(`Number of CPUs is ${CPUS}.`)
    );

    console.log(
      chalk.cyan(`Master ${process.pid} is running.`)
    );

    for (let i = 0; i < CPUS; i++) {
      cluster.fork();
    }

    cluster.on('exit', (worker, _code, _signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      cluster.fork();
    });
  } else {
    const appData = apps.pop();
    buildApp(appData, '');
  }

  spinner.succeed('Apps build complete.');
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
