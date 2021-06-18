import * as fs from 'fs';
import path from 'path';

import * as fse from 'fs-extra';

export async function symlinkNodeModules(pathToPackage: string) {
  try {
    const baseNodeModules = path.join(process.cwd(), 'node_modules');
    const destNodeModules = path.join(pathToPackage, 'node_modules');
    await fse.copySync(baseNodeModules, destNodeModules);
    console.log('Symlink Complete.');
  } catch(err) {
    console.error(err);
  }
}

export function createTmpDirectory() {
  try {
    fs.existsSync('.tmp') && fs.mkdirSync(path.join(process.cwd(), '.tmp'));
  } catch(err) {
    console.error(err);
  }
}

export function copyPackageToTmpDirectory(pathToPackage: string) {
  try {
    const tmpDir = path.join(process.cwd(), '.tmp');
    fs.existsSync('.tmp') &&
      fse.copySync(pathToPackage, tmpDir);
  } catch(err) {
    console.error(err);
  }
}
