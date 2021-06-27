// @ts-nocheck

import path from 'path';
import * as fs from 'fs';

import { getPackages } from '@lerna/project';
import { PackageGraph } from '@lerna/package-graph';
import * as _ from 'lodash';

export const getLernaDependentsForApp = async (appName: string): Promise<any | undefined> => new Promise(async (resolve, reject) => {
  try {
    const packages = await getPackages();
    const graph = new PackageGraph(packages, 'allDependencies', true);

    const dependents = {
      external: graph.get(appName).externalDependencies,
      localDependents: graph.get(appName).localDependents,
      localDependencies: graph.get(appName).localDependencies,
    };

    resolve(dependents);
  } catch (e) {
    reject(e);
  }
});

export const getElectronForgePackages = async (): Promise<any | undefined> => new Promise(async (resolve, reject) => {
  try {
    const packages = await getPackages();
    const electronForgePackages: any[] = _.filter(packages, (pkg: any) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    resolve(electronForgePackages);
  } catch (e) {
    reject(e);
  }
});

export function isLernaMonorepo() {
  const rootDir = path.resolve(process.cwd());
  const lernaConfigFile = path.join(rootDir, 'lerna.json');

  return fs.existsSync(lernaConfigFile);
}
