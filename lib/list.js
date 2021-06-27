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
exports.listCommand = void 0;
const cli_table3_1 = __importDefault(require("cli-table3"));
const chalk_1 = __importDefault(require("chalk"));
const _ = __importStar(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const lerna_1 = require("./lerna");
let spinner;
function listElectronForgePackages() {
    return __awaiter(this, void 0, void 0, function* () {
        spinner.text = 'Check if electron-forge packages are existing in lerna packages.';
        const electronForgePackages = yield lerna_1.getElectronForgePackages();
        const table = new cli_table3_1.default({
            head: ['package name', 'path']
        });
        const tableData = _.map(electronForgePackages, (efp) => {
            return [efp.name, efp.location];
        });
        _.forEach(tableData, (td) => {
            table.push(td);
        });
        console.log(chalk_1.default.red('List Electron Forge Packages'), '\n');
        console.log(table.toString());
        spinner.succeed('Checking of electron-forge package is complete.');
    });
}
function listCommand() {
    return {
        command: 'list',
        describe: 'To list electron-forge packages on lerna monorepo',
        handler: () => {
            spinner = ora_1.default('Init').start();
            if (lerna_1.isLernaMonorepo()) {
                listElectronForgePackages();
            }
            else {
                console.error(chalk_1.default.red('This directory is not a Lerna Monorepo'));
            }
            spinner.stop();
        },
    };
}
exports.listCommand = listCommand;
