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
const project_1 = require("@lerna/project");
const core_1 = require("@electron-forge/core");
const buildPackage_1 = require("./buildPackage");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        buildPackage_1.cleanTmpDirectory();
        buildPackage_1.createTmpDirectory();
        const nonElectronForgePackages = [];
        project_1.getPackages()
            .then((packages) => {
            _.forEach(packages, (pkg) => {
                const devDependencies = _.keys(pkg.devDependencies);
                if (_.includes(devDependencies, '@electron-forge/cli')) {
                    const packageName = path_1.default.basename(pkg.location);
                    buildPackage_1.copyPackageToTmpDirectory(packageName, pkg.location);
                    buildPackage_1.symlinkNodeModules(packageName);
                    core_1.api.make({
                        dir: path_1.default.join(process.cwd(), `.tmp/${packageName}`),
                        outDir: path_1.default.join(process.cwd(), `.tmp/${packageName}/target`)
                    });
                }
                if (!_.includes(devDependencies, '@electron-forge/cli')) {
                    nonElectronForgePackages.push(pkg.location);
                }
            });
            buildPackage_1.createTmpPackagesDir();
            _.map(nonElectronForgePackages, (npe) => {
                buildPackage_1.buildYarnPackage(npe);
                buildPackage_1.copyTarballsToTmpDir(npe);
            });
        })
            .catch((error) => {
            console.error(chalk_1.default.red(error));
        });
    });
}
exports.run = run;
