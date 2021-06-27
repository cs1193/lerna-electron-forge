import { getPackages } from '@lerna/project';
import * as _ from 'lodash';

export const getElectronForgePackages = async (): Promise<any | undefined> => new Promise(async (resolve, reject) => {
  try {
    const packages = await getPackages();
    const electronForgePackages: any[] = _.filter(packages, (pkg: any) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
    resolve(electronForgePackages);
  } catch (e) {
    reject(e);
  }
});
