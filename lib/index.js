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
exports.run = void 0;
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const _ = __importStar(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const project_1 = require("@lerna/project");
const buildPackage_1 = require("./buildPackage");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const spinner = ora_1.default('Building Package').start();
            spinner.text = 'Cleaning Temporary Directory';
            buildPackage_1.cleanTmpDirectory();
            spinner.text = 'Create Temporary Directory';
            buildPackage_1.createTmpDirectory();
            buildPackage_1.createTmpPackagesDir();
            spinner.text = 'Reading Packages';
            const packages = yield project_1.getPackages();
            spinner.succeed('Package read complete');
            spinner.text = 'Filtering Packages';
            const otherPackages = _.filter(packages, (pkg) => !_.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
            const electronForgePackages = _.filter(packages, (pkg) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
            spinner.succeed('Package filtered complete');
            spinner.text = 'Build Other Packages';
            const otherPackagesTmpPaths = _.map(otherPackages, (pkg) => {
                buildPackage_1.buildYarnPackage(pkg.location);
                return buildPackage_1.copyTarballsToTmpDir(pkg.location);
            });
            spinner.succeed('Other package build complete');
            spinner.text = 'Copy electron-forge packages to tmp';
            const electronForgePackagePaths = _.map(electronForgePackages, (pkg) => {
                const packageName = path_1.default.basename(pkg.location);
                const forgePackage = buildPackage_1.copyPackageToTmpDirectory(packageName, pkg.location);
                buildPackage_1.symlinkNodeModules(packageName);
                return forgePackage;
            });
            spinner.succeed('Copied package to tmp');
            spinner.text = 'Build the electron-forge packages';
            _.forEach(electronForgePackagePaths, (pkgPath) => {
                buildPackage_1.installYarnPackage(pkgPath);
                buildPackage_1.installOtherPackagesToForgePackage(pkgPath);
            });
            spinner.succeed('Built electron-forge packages');
            spinner.stop();
        }
        catch (e) {
            console.error(chalk_1.default.red(e));
        }
    });
}
exports.run = run;
