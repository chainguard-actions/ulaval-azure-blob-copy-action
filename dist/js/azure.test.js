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
const fs = __importStar(require("fs"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const azure_1 = require("./azure");
const files_1 = require("./files");
function loadParams() {
    const paramsFilename = path_1.default.join(os_1.default.homedir(), "ulaval", "ulaval.json");
    return JSON.parse(fs.readFileSync(paramsFilename, { encoding: "utf8" }));
}
const connectionString = process.env.CONNECTION_STRING || loadParams()["azure-blob-copy-action:connectionString"];
const connectOptions = { connectionString, containerName: "tests" };
test("connection strings", () => __awaiter(void 0, void 0, void 0, function* () {
    yield expect(azure_1.AzureBlobStorage.create({ connectionString, containerName: "xxx" })).rejects.toThrow();
    yield expect(azure_1.AzureBlobStorage.create(connectOptions)).resolves.toBeDefined();
}));
test("upload download file", () => __awaiter(void 0, void 0, void 0, function* () {
    const azureBlobStorage = yield azure_1.AzureBlobStorage.create(connectOptions);
    const uploadDirectory = path_1.default.join("dist", "tests", "upload");
    const uploadFilePath = path_1.default.join(uploadDirectory, "uploadFile.txt");
    const downloadDirectory = path_1.default.join("dist", "tests", "download");
    const downloadDirectory2 = path_1.default.join("dist", "tests", "download2");
    const downloadFilePath = path_1.default.join(downloadDirectory, "uploadFile.txt");
    const downloadFilePath2 = path_1.default.join(downloadDirectory2, "uploadFile.txt");
    if (fs.existsSync(downloadFilePath)) {
        fs.unlinkSync(downloadFilePath);
    }
    if (fs.existsSync(downloadFilePath2)) {
        fs.unlinkSync(downloadFilePath2);
    }
    fs.mkdirSync(uploadDirectory, { recursive: true });
    fs.writeFileSync(uploadFilePath, "Allo", { encoding: "utf8" });
    yield azureBlobStorage.uploadFile(uploadFilePath, { localDirectory: uploadDirectory });
    yield azureBlobStorage.uploadFile(uploadFilePath, { localDirectory: uploadDirectory, blobDirectory: "subdirectory" });
    yield azureBlobStorage.downloadFile("uploadFile.txt", { localDirectory: downloadDirectory });
    yield azureBlobStorage.downloadFile("uploadFile.txt", { localDirectory: downloadDirectory2 });
    expect(fs.readFileSync(downloadFilePath, { encoding: "utf8" })).toBe("Allo");
    expect(fs.readFileSync(downloadFilePath2, { encoding: "utf8" })).toBe("Allo");
}));
test("walkBlobs", () => __awaiter(void 0, void 0, void 0, function* () {
    const azureBlobStorage = yield azure_1.AzureBlobStorage.create(connectOptions);
    const count = [0];
    yield azureBlobStorage.walkBlobs((_blob) => __awaiter(void 0, void 0, void 0, function* () {
        ++count[0];
    }));
    expect(count[0]).toBeGreaterThan(0);
}));
test("upload download files", () => __awaiter(void 0, void 0, void 0, function* () {
    const downloadedPath = path_1.default.join("dist", "tests", "downloaded");
    const azureBlobStorage = yield azure_1.AzureBlobStorage.create(connectOptions);
    const countUploaded = yield azureBlobStorage.uploadFiles({ localDirectory: ".github" });
    expect(countUploaded).toBeGreaterThan(0);
    const countDownloaded = yield azureBlobStorage.downloadFiles({ localDirectory: downloadedPath });
    const i = [0];
    yield files_1.walkFiles(downloadedPath, () => __awaiter(void 0, void 0, void 0, function* () {
        i[0] += 1;
    }));
    expect(countDownloaded).toBe(i[0]);
    expect(countDownloaded).toBeGreaterThanOrEqual(countUploaded);
}));
test("computeDownloadDestFilePath", () => {
    expect(azure_1.AzureBlobStorage.computeDownloadDestFilePath("folder1/folder2/myfile.txt", { localDirectory: "." })).toBe(path_1.default.join("folder1", "folder2", "myfile.txt"));
    expect(azure_1.AzureBlobStorage.computeDownloadDestFilePath("folder1/folder2/myfile.txt", { localDirectory: "dist", blobDirectory: "folder1" })).toBe(path_1.default.join("dist", "folder2", "myfile.txt"));
    expect(azure_1.AzureBlobStorage.computeDownloadDestFilePath("/folder1/folder2/myfile.txt", { localDirectory: "dist", blobDirectory: "/folder1" })).toBe(path_1.default.join("dist", "folder2", "myfile.txt"));
    expect(azure_1.AzureBlobStorage.computeDownloadDestFilePath("folder1/folder2/myfile.txt", { localDirectory: "dist", blobDirectory: "/folder1" })).toBe(path_1.default.join("dist", "folder2", "myfile.txt"));
    expect(azure_1.AzureBlobStorage.computeDownloadDestFilePath("/folder1/folder2/myfile.txt", { localDirectory: "dist", blobDirectory: "folder1" })).toBe(path_1.default.join("dist", "folder2", "myfile.txt"));
});
