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
const lerna_1 = require("./lerna");
let spinner;
function parallelAppBuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        const electronForgePackages = yield lerna_1.getElectronForgePackages();
        _.forEach(electronForgePackages, (efp) => {
            const packageName = path_1.default.basename(efp.name);
            copyPackageToLernaElectronForgeDirectory(packageName, efp.location);
            copyDependentPackagesToLernaElectronForgeDirectory(efp.name);
            buildApp(efp.name, efp.location);
        });
    });
}
function buildApp(appName, appPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageName = path_1.default.basename(appName);
        copyPackageToLernaElectronForgeDirectory(packageName, appPath);
        console.log(appName, appPath);
    });
}
function copyDependentPackagesToLernaElectronForgeDirectory(name) {
    return __awaiter(this, void 0, void 0, function* () {
        const dependents = yield lerna_1.getLernaDependentsForApp(name);
        console.log(dependents);
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
