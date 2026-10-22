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
exports.resolveHttpHeaders = exports.match = exports.resolveContentType = void 0;
const mime_db_1 = __importDefault(require("mime-db"));
const mime = __importStar(require("mime-types"));
const minimatch_1 = __importDefault(require("minimatch"));
const path_1 = __importDefault(require("path"));
// Adding utf-8 as default charset for text files
mime_db_1.default["text/plain"]["charset"] = "UTF-8";
function resolveContentType(filePath) {
    return mime.contentType(path_1.default.basename(filePath)) || undefined;
}
exports.resolveContentType = resolveContentType;
function findHttpHeadersConfig(filePath, uploadOptions) {
    for (const { glob, httpHeaders } of uploadOptions.httpHeaders) {
        if (match(filePath, glob)) {
            return httpHeaders;
        }
    }
    return undefined;
}
function match(blobName, pattern) {
    return minimatch_1.default(blobName, pattern, { dot: true });
}
exports.match = match;
function resolveHttpHeaders(filePath, uploadOptions) {
    const httpHeaders = {};
    if (uploadOptions.httpHeaders) {
        const httpHeadersConfig = findHttpHeadersConfig(filePath, uploadOptions);
        if (httpHeadersConfig) {
            httpHeaders.blobCacheControl = httpHeadersConfig.blobCacheControl;
            httpHeaders.blobContentDisposition = httpHeadersConfig.blobContentDisposition;
            httpHeaders.blobContentEncoding = httpHeadersConfig.blobContentEncoding;
            httpHeaders.blobContentLanguage = httpHeadersConfig.blobContentLanguage;
            httpHeaders.blobContentType = httpHeadersConfig.blobContentType;
        }
    }
    if (!httpHeaders.blobContentType) {
        httpHeaders.blobContentType = resolveContentType(filePath);
    }
    return httpHeaders;
}
exports.resolveHttpHeaders = resolveHttpHeaders;
