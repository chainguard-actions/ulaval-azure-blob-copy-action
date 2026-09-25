"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpheaders_1 = require("./httpheaders");
test("resolveContentType", () => {
    expect(httpheaders_1.resolveContentType("test.txt")).toBe("text/plain; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.css")).toBe("text/css; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.html")).toBe("text/html; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.js")).toBe("application/javascript; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.js.map")).toBe("application/json; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.json")).toBe("application/json; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test.ico")).toBe("image/vnd.microsoft.icon");
    expect(httpheaders_1.resolveContentType("test.yml")).toBe("text/yaml; charset=utf-8");
    expect(httpheaders_1.resolveContentType("test/test.yml")).toBe("text/yaml; charset=utf-8");
});
test("resolveHttpHeaders", () => {
    const resolve = function (httpHeaders) {
        return httpheaders_1.resolveHttpHeaders("folder1/test.js", { localDirectory: ".", httpHeaders });
    };
    expect(resolve().blobCacheControl).toBeUndefined();
    expect(resolve([]).blobCacheControl).toBeUndefined();
    expect(resolve([{ glob: "**/*.ts", httpHeaders: { blobCacheControl: "public" } }]).blobCacheControl).toBeUndefined();
    expect(resolve([{ glob: "**/*.js", httpHeaders: { blobCacheControl: "public" } }]).blobCacheControl).toBe("public");
});
test("minimatch", () => {
    expect(httpheaders_1.match("folder1/test.js", "**/*.js")).toBe(true);
    expect(httpheaders_1.match("folder1/test.123456.js", "**/*.??????.js")).toBe(true);
    expect(httpheaders_1.match("folder1/test.js", "**/*.+(ts|js)")).toBe(true);
    expect(httpheaders_1.match("folder1/test.js", "!**/*.js")).toBe(false);
    expect(httpheaders_1.match("folder1/test.js", "{**/*.ts,**/*.js}")).toBe(true);
});
