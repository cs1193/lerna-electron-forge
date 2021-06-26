import chalk from "chalk";

export async function run() {
  const yargs = require('yargs/yargs')(process.argv.slice(2));
  yargs
    .usage(`${chalk.bold('lerna-electron-forge')} subcommand [options]`)
    .demandCommand()
    .help('help')
    .argv;
}
