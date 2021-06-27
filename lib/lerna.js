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
exports.isLernaMonorepo = exports.getElectronForgePackages = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const project_1 = require("@lerna/project");
const _ = __importStar(require("lodash"));
const getElectronForgePackages = () => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const packages = yield project_1.getPackages();
            const electronForgePackages = _.filter(packages, (pkg) => _.includes(_.keys(pkg.devDependencies), '@electron-forge/cli'));
            resolve(electronForgePackages);
        }
        catch (e) {
            reject(e);
        }
    }));
});
exports.getElectronForgePackages = getElectronForgePackages;
function isLernaMonorepo() {
    const rootDir = path_1.default.resolve(process.cwd());
    const lernaConfigFile = path_1.default.join(rootDir, 'lerna.json');
    return fs.existsSync(lernaConfigFile);
}
exports.isLernaMonorepo = isLernaMonorepo;
