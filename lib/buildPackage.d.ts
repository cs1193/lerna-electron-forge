export declare function symlinkNodeModules(packageName: string): Promise<void>;
export declare function createTmpDirectory(): void;
export declare function copyPackageToTmpDirectory(packageName: string, pathToPackage: string): string | false;
export declare function cleanTmpDirectory(): void;
export declare function installYarnPackage(pathToPackage: string): void;
export declare function buildYarnPackage(pathToPackage: string): void;
export declare function copyTarballsToTmpDir(pathToPackage: string): string[];
export declare function createTmpPackagesDir(): void;
export declare function installOtherPackagesToForgePackage(pathToPackage: string): void;
