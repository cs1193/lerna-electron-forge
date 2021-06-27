import chalk from "chalk";

import { initCommand } from './init';

export async function run() {
  const yargs = require('yargs/yargs')(process.argv.slice(2));
  yargs
    .usage(`${chalk.bold('lerna-electron-forge')} subcommand [options]`)
    .command(initCommand)
    .demandCommand()
    .help('help')
    .argv;
}
