import chalk from "chalk";

import { listCommand } from './list';
import { buildCommand } from './build';

export async function run() {
  const yargs = require('yargs/yargs')(process.argv.slice(2));
  yargs
    .usage(`${chalk.bold('lerna-electron-forge')} subcommand [options]`)
    .command(listCommand())
    .command(buildCommand())
    .demandCommand()
    .help('help')
    .argv;
}
