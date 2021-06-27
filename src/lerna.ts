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

    const dependents = graph.get(appName).localDependencies && _.keys(graph.get(appName).localDependencies);
    console.log(dependents);

    const filteredDependents = _.filter(packages, (pkg: any) => {
      console.log(pkg);
      _.forEach(dependents, (dep: any, index: number) => {
        console.log(`d ${index}`, dep);
        if (_.isEqual(pkg.name, dep.name)) {
          console.log('matched', index);
          return pkg;
        }
      })
    });

    resolve(filteredDependents);
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
