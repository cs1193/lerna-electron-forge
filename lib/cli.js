"use strict";
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
const init_1 = require("./init");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const yargs = require('yargs/yargs')(process.argv.slice(2));
        yargs
            .usage(`${chalk_1.default.bold('lerna-electron-forge')} subcommand [options]`)
            .command(init_1.initCommand)
            .demandCommand()
            .help('help')
            .argv;
    });
}
exports.run = run;
