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
exports.readForgeConfigFile = exports.lernaBuildPackages = exports.lernaBootstrap = exports.makeForgePackage = exports.installOtherPackagesToForgePackage = exports.createTmpPackagesDir = exports.copyTarballsToTmpDir = exports.buildYarnPackage = exports.installYarnPackage = exports.cleanTmpDirectory = exports.copyPackageToTmpDirectory = exports.createTmpDirectory = exports.symlinkNodeModules = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const cross_spawn_1 = __importDefault(require("cross-spawn"));
const glob_1 = __importDefault(require("glob"));
const fse = __importStar(require("fs-extra"));
const _ = __importStar(require("lodash"));
const core_1 = require("@electron-forge/core");
function symlinkNodeModules(packageName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const baseNodeModules = path_1.default.join(process.cwd(), 'node_modules');
            const destNodeModules = path_1.default.join(process.cwd(), `.tmp/${packageName}`, 'node_modules');
            yield fse.copySync(baseNodeModules, destNodeModules);
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.symlinkNodeModules = symlinkNodeModules;
function createTmpDirectory() {
    try {
        !fs.existsSync('.tmp') && fs.mkdirSync(path_1.default.join(process.cwd(), '.tmp'));
    }
    catch (err) {
        console.error(err);
    }
}
exports.createTmpDirectory = createTmpDirectory;
function copyPackageToTmpDirectory(packageName, pathToPackage) {
    try {
        const tmpDir = path_1.default.join(process.cwd(), `.tmp/${packageName}`);
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
exports.copyPackageToTmpDirectory = copyPackageToTmpDirectory;
function cleanTmpDirectory() {
    try {
        rimraf_1.default.sync(path_1.default.join(process.cwd(), '.tmp'));
    }
    catch (err) {
        console.error(err);
    }
}
exports.cleanTmpDirectory = cleanTmpDirectory;
function installYarnPackage(pathToPackage) {
    process.chdir(pathToPackage);
    cross_spawn_1.default.sync('yarn');
    process.chdir('../');
}
exports.installYarnPackage = installYarnPackage;
function buildYarnPackage(pathToPackage) {
    process.chdir(pathToPackage);
    cross_spawn_1.default.sync('yarn', ['pack']);
    process.chdir('../../');
}
exports.buildYarnPackage = buildYarnPackage;
function copyTarballsToTmpDir(pathToPackage) {
    const tmpPackagesDir = path_1.default.join(process.cwd(), '.tmp', 'packages');
    const tarballs = glob_1.default.sync(`${pathToPackage}/*.tgz`);
    return _.map(tarballs, (tarball) => {
        const filename = path_1.default.basename(tarball);
        const filepath = path_1.default.join(tmpPackagesDir, filename);
        fse.copySync(tarball, filepath);
        return filepath;
    });
}
exports.copyTarballsToTmpDir = copyTarballsToTmpDir;
function createTmpPackagesDir() {
    try {
        const tmpPackagesDir = path_1.default.join(process.cwd(), '.tmp', 'packages');
        !fs.existsSync(tmpPackagesDir) &&
            fs.mkdirSync(tmpPackagesDir);
    }
    catch (err) {
        console.error(err);
    }
}
exports.createTmpPackagesDir = createTmpPackagesDir;
function installOtherPackagesToForgePackage(pathToPackage) {
    try {
        const tmpPackagesDir = path_1.default.join(process.cwd(), '.tmp', 'packages');
        const tarballPackages = glob_1.default.sync(`${tmpPackagesDir}/*.tgz`);
        process.chdir(pathToPackage);
        _.forEach(tarballPackages, (tarball) => {
            const filename = path_1.default.basename(tarball);
            fse.copySync(tarball, `${pathToPackage}/${filename}`);
            cross_spawn_1.default.sync('yarn', ['install', `${filename}`]);
        });
        process.chdir('../../');
    }
    catch (err) {
        console.error(err);
    }
}
exports.installOtherPackagesToForgePackage = installOtherPackagesToForgePackage;
function makeForgePackage(pathToPackage) {
    try {
        core_1.api.make({
            dir: pathToPackage
        });
    }
    catch (err) {
        console.error(err);
    }
}
exports.makeForgePackage = makeForgePackage;
function lernaBootstrap() {
    try {
        cross_spawn_1.default.sync('lerna', ['bootstrap']);
    }
    catch (err) {
        console.error(err);
    }
}
exports.lernaBootstrap = lernaBootstrap;
function lernaBuildPackages() {
    try {
        cross_spawn_1.default.sync('lerna', ['build']);
    }
    catch (err) {
        console.error(err);
    }
}
exports.lernaBuildPackages = lernaBuildPackages;
function readForgeConfigFile(pathToPackage) {
    try {
        const tmpPackagesDir = path_1.default.join(process.cwd(), '.tmp');
        process.chdir(pathToPackage);
        const forgeConfigPath = path_1.default.join(pathToPackage, 'forge.config.js');
        if (!fs.existsSync(forgeConfigPath)) {
            return false;
        }
        const configData = fs.readFileSync(forgeConfigPath);
        const { plugins } = configData;
        let webpackData = _.filter(plugins, (plugin) => plugin[0] === '@electron-forge/plugin-webpack');
        webpackData = webpackData && webpackData.length > 0 && webpackData[0] && webpackData[0][1];
        const { renderer } = webpackData;
        if (!renderer) {
            return false;
        }
        const { entryPoints } = renderer;
        _.forEach(entryPoints, (entryPoint) => {
            const ep = path_1.default.dirname(entryPoint.html);
            const epSplit = ep.split(path_1.default.sep);
            const epDir = epSplit[epSplit.length - 2];
            const originalPackage = path_1.default.join('../../packages', epDir);
            fse.copySync(originalPackage, tmpPackagesDir);
        });
        process.chdir('../../');
        return entryPoints;
    }
    catch (err) {
        console.error(err);
        return false;
    }
}
exports.readForgeConfigFile = readForgeConfigFile;
