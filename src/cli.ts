import chalk from "chalk";

export async function run() {
  const yargs = require('yargs');

  const argv = yargs
    .usage('lerna-electron-forge [options]')
    .options({
      build: {
        type: "string"
      }
    })
    .example(
      "lerna-electron-forge build"
    )
    .epilog("For more information, see https://github.com/cs1193/lerna-electron-forge")
    .parse();
}
