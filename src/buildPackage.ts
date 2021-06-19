import * as fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import spawn from 'cross-spawn';
import glob from 'glob';

import * as fse from 'fs-extra';

export async function symlinkNodeModules(packageName: string) {
  try {
    const baseNodeModules = path.join(process.cwd(), 'node_modules');
    const destNodeModules = path.join(process.cwd(), `.tmp/${packageName}`, 'node_modules');
    await fse.copySync(baseNodeModules, destNodeModules);
    console.log('Symlink Complete.');
  } catch(err) {
    console.error(err);
  }
}

export function createTmpDirectory() {
  try {
    !fs.existsSync('.tmp') && fs.mkdirSync(path.join(process.cwd(), '.tmp'));
  } catch(err) {
    console.error(err);
  }
}

export function copyPackageToTmpDirectory(packageName: string, pathToPackage: string) {
  try {
    const tmpDir = path.join(process.cwd(), `.tmp/${packageName}`);
    console.log(pathToPackage, tmpDir);
    fse.copySync(pathToPackage, tmpDir, {
      filter: (src) => {
        return src.indexOf('node_modules') === -1;
      }
    });
  } catch(err) {
    console.error(err);
  }
}

export function cleanTmpDirectory() {
  try {
    rimraf.sync(path.join(process.cwd(), '.tmp'));
  } catch(err) {
    console.error(err);
  }
}

export function buildYarnPackage(pathToPackage: string) {
  process.chdir(pathToPackage);
  spawn.sync('yarn', ['pack'])
  process.chdir('../../');
  const tarballs = glob.sync(`${pathToPackage}/*.tgz`);
  console.log(tarballs);
}
