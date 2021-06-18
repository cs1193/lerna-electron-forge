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
exports.cleanTmpDirectory = exports.copyPackageToTmpDirectory = exports.createTmpDirectory = exports.symlinkNodeModules = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const rimraf_1 = __importDefault(require("rimraf"));
const fse = __importStar(require("fs-extra"));
function symlinkNodeModules(pathToPackage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const baseNodeModules = path_1.default.join(process.cwd(), 'node_modules');
            const destNodeModules = path_1.default.join(pathToPackage, 'node_modules');
            yield fse.copySync(baseNodeModules, destNodeModules);
            console.log('Symlink Complete.');
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.symlinkNodeModules = symlinkNodeModules;
function createTmpDirectory() {
    try {
        !fs.existsSync('.tmp') && fs.mkdirSync(path_1.default.join(process.cwd(), '.tmp'));
    }
    catch (err) {
        console.error(err);
    }
}
exports.createTmpDirectory = createTmpDirectory;
function copyPackageToTmpDirectory(packageName, pathToPackage) {
    try {
        const tmpDir = path_1.default.join(process.cwd(), `.tmp/${packageName}`);
        console.log(pathToPackage, tmpDir);
        fse.copySync(pathToPackage, tmpDir, {
            filter: function (src) {
                return src.indexOf('node_modules') > -1;
            }
        });
    }
    catch (err) {
        console.error(err);
    }
}
exports.copyPackageToTmpDirectory = copyPackageToTmpDirectory;
function cleanTmpDirectory() {
    try {
        rimraf_1.default.sync(path_1.default.join(process.cwd(), '.tmp'));
    }
    catch (err) {
        console.error(err);
    }
}
exports.cleanTmpDirectory = cleanTmpDirectory;
