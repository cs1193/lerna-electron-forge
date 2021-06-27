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
const cluster_1 = __importDefault(require("cluster"));
const os = __importStar(require("os"));
const chalk_1 = __importDefault(require("chalk"));
const _ = __importStar(require("lodash"));
const ora_1 = __importDefault(require("ora"));
const lerna_1 = require("./lerna");
const CPUS = os.cpus().length;
let spinner;
function parallelAppBuilds() {
    return __awaiter(this, void 0, void 0, function* () {
        const electronForgePackages = yield lerna_1.getElectronForgePackages();
        console.log(electronForgePackages.length);
        const apps = _.map(electronForgePackages, (efp) => {
            return {
                name: efp.name,
                location: efp.location
            };
        });
        console.log('apps.length', apps.length);
        let appData;
        if (cluster_1.default.isMaster) {
            console.log(chalk_1.default.yellow(`Number of CPUs is ${CPUS}.`));
            console.log(chalk_1.default.cyan(`Master ${process.pid} is running.`));
            for (let i = 0; i < CPUS; i++) {
                if (apps.length > 0) {
                    appData = apps.pop();
                    console.log('appData in cpus', appData);
                    cluster_1.default.fork();
                }
            }
            cluster_1.default.on('online', (worker) => {
                console.log(`Worker ${worker.process.pid} is online`);
            });
            cluster_1.default.on('exit', (worker, _code, _signal) => {
                console.log(`Worker ${worker.process.pid} died`);
            });
        }
        else {
            console.log(appData);
            if (appData) {
                console.log('Reach Here');
                buildApp(appData.name, appData.location, () => {
                    process.exit(0);
                });
            }
        }
    });
}
function buildApp(appName, appPath, callback) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(appName, appPath);
        callback();
    });
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
