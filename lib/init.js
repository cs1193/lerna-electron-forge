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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const chalk_1 = __importDefault(require("chalk"));
function appendLernaElectroForgeToGitignore() {
    const rootDir = path_1.default.resolve(process.cwd());
    const gitignoreFile = path_1.default.join(rootDir, '.gitignore');
    const gitignoreData = `
    // .lerna-electron-forge gitignore. DO NOT REMOVE.
    .lerna-electron-forge
  `;
    fs.existsSync(gitignoreFile) && fs.appendFileSync(gitignoreFile, gitignoreData);
}
function createLernaElectronForgeDirectory() {
    const rootDir = path_1.default.resolve(process.cwd());
    const lernaElectronForgeDirectory = path_1.default.join(rootDir, '.lerna-electron-forge');
    fs.existsSync(lernaElectronForgeDirectory) && fs.mkdirSync(lernaElectronForgeDirectory);
}
function isLernaMonorepo() {
    const rootDir = path_1.default.resolve(process.cwd());
    const lernaConfigFile = path_1.default.join(rootDir, 'lerna.json');
    return fs.existsSync(lernaConfigFile);
}
function initCommand() {
    return {
        command: 'init',
        describe: 'To provision electron-forge build on lerna monorepo',
        handler: () => {
            if (isLernaMonorepo()) {
                createLernaElectronForgeDirectory();
                appendLernaElectroForgeToGitignore();
            }
            else {
                console.error(chalk_1.default.red('This directory is not a Lerna Monorepo'));
            }
        },
    };
}
exports.initCommand = initCommand;
