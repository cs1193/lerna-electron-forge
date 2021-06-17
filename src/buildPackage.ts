import path from 'path';

import * as fse from 'fs-extra';

export async function symlinkNodeModules(pathToPackage: string) {
  try {
    const baseNodeModules = path.join(process.cwd(), 'node_modules');
    await fse.ensureSymlink(baseNodeModules, pathToPackage);
    console.log('Symlink Complete.');
  } catch(err) {
    console.error(err);
  }
}
