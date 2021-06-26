import * as fs from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import spawn from 'cross-spawn';
import glob from 'glob';

import * as fse from 'fs-extra';
import * as _ from 'lodash';
import { api } from '@electron-forge/core';

export async function symlinkNodeModules(packageName: string) {
  try {
    const baseNodeModules = path.join(process.cwd(), 'node_modules');
    const destNodeModules = path.join(process.cwd(), `.tmp/${packageName}`, 'node_modules');
    await fse.copySync(baseNodeModules, destNodeModules);
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
    fse.copySync(pathToPackage, tmpDir, {
      filter: (src) => {
        return src.indexOf('node_modules') === -1;
      }
    });
    return tmpDir;
  } catch(err) {
    console.error(err);
    return false;
  }
}

export function cleanTmpDirectory() {
  try {
    rimraf.sync(path.join(process.cwd(), '.tmp'));
  } catch(err) {
    console.error(err);
  }
}

export function installYarnPackage(pathToPackage: string) {
  process.chdir(pathToPackage);
  spawn.sync('yarn');
  process.chdir('../');
}

export function buildYarnPackage(pathToPackage: string) {
  process.chdir(pathToPackage);
  spawn.sync('yarn', ['pack'])
  process.chdir('../../');
}

export function copyTarballsToTmpDir(pathToPackage: string) {
  const tmpPackagesDir = path.join(process.cwd(), '.tmp', 'packages');
  const tarballs = glob.sync(`${pathToPackage}/*.tgz`);
  return _.map(tarballs, (tarball: string) => {
    const filename = path.basename(tarball);
    const filepath = path.join(tmpPackagesDir, filename);
    fse.copySync(tarball, filepath);
    return filepath;
  });
}

export function createTmpPackagesDir() {
  try {
    const tmpPackagesDir = path.join(process.cwd(), '.tmp', 'packages');
    !fs.existsSync(tmpPackagesDir) &&
      fs.mkdirSync(tmpPackagesDir);
  } catch(err) {
    console.error(err);
  }
}

export function installOtherPackagesToForgePackage(pathToPackage: string) {
  try {
    const tmpPackagesDir = path.join(process.cwd(), '.tmp', 'packages');
    const tarballPackages = glob.sync(`${tmpPackagesDir}/*.tgz`);

    process.chdir(pathToPackage);
    _.forEach(tarballPackages, (tarball: string) => {
      const filename = path.basename(tarball);
      fse.copySync(tarball, `${pathToPackage}/${filename}`);
      spawn.sync('yarn', ['install', `${filename}`]);
    });
    process.chdir('../../');
  } catch(err) {
    console.error(err);
  }
}

export function makeForgePackage(pathToPackage: string) {
  try {
    api.make({
      dir: pathToPackage
    });
  } catch(err) {
    console.error(err);
  }
}

export function lernaBootstrap() {
  try {
    spawn.sync('lerna', ['bootstrap']);
  } catch(err) {
    console.error(err);
  }
}

export function lernaBuildPackages() {
  try {
    spawn.sync('lerna', ['build']);
  } catch(err) {
    console.error(err);
  }
}

export function readForgeConfigFile(pathToPackage: string) {
  try {
    const tmpPackagesDir = path.join(process.cwd(), '.tmp');
    process.chdir(pathToPackage);
    const forgeConfigPath = path.join(pathToPackage, 'forge.config.js');

    if (!fs.existsSync(forgeConfigPath)) {
      return false;
    }

    const configData = fs.readFileSync(forgeConfigPath);

    // @ts-ignore
    const { plugins } = configData;
    let webpackData = _.filter(plugins, (plugin: any) => plugin[0] === '@electron-forge/plugin-webpack');
    webpackData = webpackData && webpackData.length > 0 && webpackData[0] && webpackData[0][1];

    // @ts-ignore
    const { renderer } = webpackData;

    if (!renderer) {
      return false;
    }

    const { entryPoints } = renderer;

    _.forEach(entryPoints, (entryPoint) => {
      const ep = path.dirname(entryPoint.html)
      const epSplit = ep.split(path.sep);
      const epDir = epSplit[epSplit.length - 2];
      const originalPackage = path.join('../../packages', epDir);
      // const mainFilePath = glob.sync(path.join(ep, 'build', 'main.*'));
      // const mainFile = path.basename(mainFilePath[0]);
      fse.copySync(originalPackage, tmpPackagesDir);
    });

    process.chdir('../../');

    return entryPoints;

  } catch(err) {
    console.error(err);
    return false;
  }
}
