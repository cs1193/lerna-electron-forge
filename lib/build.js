"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCommand = void 0;
const ora_1 = __importDefault(require("ora"));
let spinner;
function buildCommand() {
    return {
        command: 'build',
        describe: 'To build electron-forge app',
        handler: () => {
            spinner = ora_1.default('Build').start();
            console.log('build');
            spinner.stop();
        },
    };
}
exports.buildCommand = buildCommand;
