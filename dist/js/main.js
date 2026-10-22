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
exports.parseHttpHeaders = void 0;
const core = __importStar(require("@actions/core"));
const yaml_1 = __importDefault(require("yaml"));
const copy_1 = require("./copy");
function mapHttpHeaders(entry) {
    if (!entry.glob) {
        throw new Error("The glob is required");
    }
    if (!entry.headers) {
        return { glob: entry.glob.toString(), httpHeaders: {} };
    }
    return {
        glob: entry.glob.toString(),
        httpHeaders: {
            blobCacheControl: entry.headers["Cache-Control"],
            blobContentDisposition: entry.headers["Content-Disposition"],
            blobContentEncoding: entry.headers["Content-Encoding"],
            blobContentLanguage: entry.headers["Content-Language"],
            blobContentType: entry.headers["Content-Type"],
        }
    };
}
function parseHttpHeaders(yamlInput) {
    core.info("http_headers: \n" + yamlInput);
    if (!yamlInput) {
        return [];
    }
    const parsedHttpHeaders = yaml_1.default.parse(yamlInput);
    if (!Array.isArray(parsedHttpHeaders)) {
        return [];
    }
    return parsedHttpHeaders.map(entry => mapHttpHeaders(entry));
}
exports.parseHttpHeaders = parseHttpHeaders;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const action = core.getInput("action", { required: true });
        const connectionString = core.getInput("connection_string", { required: true });
        const containerName = core.getInput("container_name", { required: true });
        const blobDirectory = core.getInput("blob_directory", { required: false });
        const localDirectory = core.getInput("local_directory", { required: true });
        const httpHeaders = parseHttpHeaders(core.getInput("http_headers", { required: false }));
        yield copy_1.copy(new copy_1.CopyParameters(action, connectionString, containerName, blobDirectory, localDirectory, httpHeaders));
    });
}
run().catch(e => {
    core.setFailed(e.message);
    core.debug(e.stack);
    core.error(e.message);
});
