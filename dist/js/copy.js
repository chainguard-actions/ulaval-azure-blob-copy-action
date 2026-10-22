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
Object.defineProperty(exports, "__esModule", { value: true });
exports.copy = exports.CopyParameters = void 0;
const core = __importStar(require("@actions/core"));
const azure = __importStar(require("./azure"));
class CopyParameters {
    constructor(action, connectionString, containerName, blobDirectory, localDirectory, httpHeaders) {
        this.action = action;
        this.connectionString = connectionString;
        this.containerName = containerName;
        this.blobDirectory = blobDirectory;
        this.localDirectory = localDirectory;
        this.httpHeaders = httpHeaders;
        if (!(action === "upload" || action === "download")) {
            throw new Error("The action input is required and must be 'upload' or 'download'.");
        }
        if (!connectionString) {
            throw new Error("The connection_string input is required.");
        }
        if (!containerName) {
            throw new Error("The container_name input is required.");
        }
        if (!localDirectory) {
            throw new Error("The local_directory input is required.");
        }
    }
    isUpload() {
        return this.action === "upload";
    }
}
exports.CopyParameters = CopyParameters;
function doUpload(params) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(`Uploading files from ${params.localDirectory} to the ${params.containerName} container...`);
        const azureBlobStorage = yield azure.AzureBlobStorage.create(params);
        const count = yield azureBlobStorage.uploadFiles(params);
        core.info(`Copied ${count} blobs successfully.`);
    });
}
function doDownload(params) {
    return __awaiter(this, void 0, void 0, function* () {
        core.info(`Downloading blobs to ${params.localDirectory} from the ${params.containerName} container...`);
        const azureBlobStorage = yield azure.AzureBlobStorage.create(params);
        const count = yield azureBlobStorage.downloadFiles(params);
        core.info(`Copied ${count} blobs successfully.`);
    });
}
function copy(params) {
    return __awaiter(this, void 0, void 0, function* () {
        if (params.isUpload()) {
            yield doUpload(params);
        }
        else {
            doDownload(params);
        }
    });
}
exports.copy = copy;
