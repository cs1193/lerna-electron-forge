import path from 'path';

import * as fse from 'fs-extra';

export async function symlinkNodeModules(pathToPackage: string) {
  try {
    const baseNodeModules = path.join(process.cwd(), 'node_modules');
    const destNodeModules = path.join(pathToPackage, 'node_modules');
    await fse.copyFileSync(baseNodeModules, destNodeModules);
    console.log('Symlink Complete.');
  } catch(err) {
    console.error(err);
  }
}
