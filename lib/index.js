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
const chalk_1 = __importDefault(require("chalk"));
const _ = __importStar(require("lodash"));
const project_1 = require("@lerna/project");
const pack_directory_1 = require("@lerna/pack-directory");
const core_1 = require("@electron-forge/core");
const buildPackage_1 = require("./buildPackage");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const yargs = require('yargs');
        const argv = yargs
            .usage('lerna-electron-forge [options]')
            .options({
            list: {
                type: "boolean"
            },
            build: {
                type: "string"
            }
        })
            .example("lerna-electron-forge build")
            .epilog("For more information, see https://github.com/cs1193/lerna-electron-forge")
            .argv;
        console.log(argv);
        buildPackage_1.createTmpDirectory();
        project_1.getPackages()
            .then((packages) => {
            _.forEach(packages, (pkg, index) => {
                pack_directory_1.packDirectory(pkg, pkg.location);
                const devDependencies = _.keys(pkg.devDependencies);
                if (_.includes(devDependencies, '@electron-forge/cli')) {
                    buildPackage_1.copyPackageToTmpDirectory(pkg.location);
                    console.log(pkg.name, index);
                    buildPackage_1.symlinkNodeModules(pkg.location);
                    core_1.api.package(pkg.location);
                }
            });
        })
            .catch((error) => {
            console.error(chalk_1.default.red(error));
        });
    });
}
exports.run = run;
