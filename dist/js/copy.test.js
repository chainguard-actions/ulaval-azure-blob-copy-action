"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const copy_1 = require("./copy");
test("class CopyParameters", () => {
    expect(() => {
        new copy_1.CopyParameters("xxx", "d", "c", undefined, "d");
    }).toThrow("The action input is required and must be 'upload' or 'download'.");
    expect(() => {
        new copy_1.CopyParameters("upload", "", "c", undefined, "d");
    }).toThrow("The connection_string input is required.");
    expect(() => {
        new copy_1.CopyParameters("upload", "d", "", undefined, "d");
    }).toThrow("The container_name input is required.");
    expect(() => {
        new copy_1.CopyParameters("upload", "x", "x", undefined, "");
    }).toThrow("The local_directory input is required.");
});
