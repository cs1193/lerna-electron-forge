import cluster from 'cluster';
import * as os from 'os';

import chalk from 'chalk';
import * as _ from 'lodash';
import ora from 'ora';

import { getElectronForgePackages } from './lerna';

const CPUS = os.cpus().length;

let spinner: any;

async function parallelAppBuilds() {
  const electronForgePackages = await getElectronForgePackages();

  const apps = _.map(electronForgePackages, (efp) => {
    return {
      name: efp.name,
      location: efp.location
    };
  });

  let appData: any;

  if (cluster.isMaster) {
    console.log(
      chalk.yellow(`Number of CPUs is ${CPUS}.`)
    );

    console.log(
      chalk.cyan(`Master ${process.pid} is running.`)
    );

    for (let i = 0; i < CPUS; i++) {
      if (apps.length > 0) {
        appData = apps.pop();
        const worker = cluster.fork();
        worker.send(appData);
      }
    }

    cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online`);
    });

    cluster.on('exit', (worker, _code, _signal) => {
      console.log(`Worker ${worker.process.pid} died`);
      // if (apps.length > 0) {
      //   appData = apps.pop();
      //   cluster.fork();
      // }
    });
  } else {
    process.on('message', (appData) => {
      if (appData) {
        // @ts-ignore
        buildApp(appData.name, appData.location, () => {
          process.exit(0);
        });
      }
    });
  }
}

async function buildApp(appName: string, appPath: string, callback: Function) {
  console.log(appName, appPath);
  callback();
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
