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
exports.initCommand = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
const _ = __importStar(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const lernaData_1 = require("./lernaData");
let spinner;
function appendLernaElectroForgeToGitignore() {
    spinner.text = 'Adding cache directory to gitignore.';
    const rootDir = path_1.default.resolve(process.cwd());
    const gitignoreFile = path_1.default.join(rootDir, '.gitignore');
    const gitignoreData = `\n// .lerna-electron-forge gitignore. DO NOT REMOVE.\n.lerna-electron-forge`;
    fs.existsSync(gitignoreFile) && fs.appendFileSync(gitignoreFile, gitignoreData);
    spinner.succeed('Cache directory addition is complete.');
}
function createLernaElectronForgeDirectory() {
    spinner.text = 'Create .lerna-electron-forge cache directory on <rootDir>.';
    const rootDir = path_1.default.resolve(process.cwd());
    const lernaElectronForgeDirectory = path_1.default.join(rootDir, '.lerna-electron-forge');
    !fs.existsSync(lernaElectronForgeDirectory) && fs.mkdirSync(lernaElectronForgeDirectory);
    spinner.succeed('Create directory is complete.');
}
function listElectronForgePackages() {
    return __awaiter(this, void 0, void 0, function* () {
        spinner.text = 'Check if electron-forge packages are existing in lerna packages.';
        const electronForgePackages = yield lernaData_1.getElectronForgePackages();
        const table = new cli_table3_1.default({
            head: ['package name', 'path']
        });
        const tableData = _.map(electronForgePackages, (efp) => {
            return [efp.name, efp.path];
        });
        _.forEach(tableData, (td) => {
            table.push(td);
        });
        console.log(chalk_1.default.red('List Electron Forge Packages'), '\n');
        console.log(table.toString());
        spinner.succeed('Checking of electron-forge package is complete.');
    });
}
function initCommand() {
    return {
        command: 'init',
        describe: 'To provision electron-forge build on lerna monorepo',
        handler: () => {
            spinner = ora_1.default('Init').start();
            if (lernaData_1.isLernaMonorepo()) {
                createLernaElectronForgeDirectory();
                appendLernaElectroForgeToGitignore();
                listElectronForgePackages();
            }
            else {
                console.error(chalk_1.default.red('This directory is not a Lerna Monorepo'));
            }
            spinner.stop();
        },
    };
}
exports.initCommand = initCommand;
