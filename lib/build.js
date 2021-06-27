"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = void 0;
const path_1 = __importDefault(require("path"));
const _ = __importStar(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const fse = __importStar(require("fs-extra"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const glob_1 = __importDefault(require("glob"));
const core_1 = require("@electron-forge/core");
const lerna_1 = require("./lerna");
let spinner;
function parallelAppBuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        lernaBootstrap();
        const electronForgePackages = yield lerna_1.getElectronForgePackages();
        _.forEach(electronForgePackages, (efp) => {
            buildApp(efp.name, efp.location);
        });
    });
}
function buildApp(appName, appPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core_1.api.make({
                dir: appPath
            });
        }
        catch (err) {
            console.error(err);
        }
    });
}
function copyDependentPackagesToLernaElectronForgeDirectory(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const dependents = yield lerna_1.getLernaDependentsForApp(name);
        _.forEach(dependents, (dep) => {
            createTarballs(dep.location);
            copyTarballsToLernaElectronForgeDirectory(dep.location);
        });
    });
}
function createTarballs(pathToPackage) {
    process.chdir(pathToPackage);
    cross_spawn_1.default.sync('yarn', ['pack']);
    process.chdir('../../');
}
function copyTarballsToLernaElectronForgeDirectory(pathToPackage) {
    const tmpDir = path_1.default.join(process.cwd(), `.lerna-electron-forge`, `packages`);
    const tarballs = glob_1.default.sync(`${pathToPackage}/*.tgz`);
    return _.map(tarballs, (tarball) => {
        const filename = path_1.default.basename(tarball);
        const filepath = path_1.default.join(tmpDir, filename);
        fse.copySync(tarball, filepath);
        return filepath;
    });
}
function installDependentTarballs(appName, packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const tmpDir = path_1.default.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
            const tmpPackagesDir = path_1.default.join(process.cwd(), `.lerna-electron-forge`, `packages`);
            const dependents = yield lerna_1.getLernaDependentsForApp(appName);
            process.chdir(tmpDir);
            _.forEach(dependents, (dep) => {
                const depPackageName = path_1.default.basename(dep.location);
                const tarballs = glob_1.default.sync(`${tmpPackagesDir}/${depPackageName}-*`);
                if (tarballs && tarballs.length > 0 && tarballs[0]) {
                    cross_spawn_1.default.sync('yarn', ['install', `${tarballs[0]}`]);
                }
            });
            process.chdir('../../');
        }
        catch (err) {
            console.error(err);
        }
    });
}
function copyPackageToLernaElectronForgeDirectory(packageName, pathToPackage) {
    try {
        const tmpDir = path_1.default.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
        fse.copySync(pathToPackage, tmpDir, {
            filter: (src) => {
                return src.indexOf('node_modules') === -1;
            }
        });
        return tmpDir;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
function installYarnPackage(packageName) {
    const tmpDir = path_1.default.join(process.cwd(), `.lerna-electron-forge/${packageName}`);
    process.chdir(tmpDir);
    cross_spawn_1.default.sync('yarn');
    process.chdir('../../');
}
function lernaBootstrap() {
    try {
        cross_spawn_1.default.sync('lerna', ['bootstrap']);
    }
    catch (err) {
        console.error(err);
    }
}
function buildCommand() {
    return {
        command: 'build',
        describe: 'To build electron-forge app',
        handler: () => {
            spinner = ora_1.default('Build').start();
            parallelAppBuilds();
            spinner.stop();
        },
    };
}
exports.buildCommand = buildCommand;
