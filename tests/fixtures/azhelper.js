// Usage:
//   node azhelper.js create-container <name>
//   node azhelper.js put <container> <blobName> <content>
//   node azhelper.js list <container>             -> prints blob names, one per line
//   node azhelper.js get <container> <blobName>   -> prints content
//   node azhelper.js props <container> <blobName> -> prints JSON of http headers
const { BlobServiceClient } = require("@azure/storage-blob");

const CONN =
  "DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;" +
  "AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;" +
  "BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;";

async function streamToString(s) {
  const chunks = [];
  for await (const c of s) chunks.push(Buffer.from(c));
  return Buffer.concat(chunks).toString("utf8");
}

async function main() {
  const [cmd, container, blob, content] = process.argv.slice(2);
  const svc = BlobServiceClient.fromConnectionString(CONN);
  const cc = svc.getContainerClient(container);
  switch (cmd) {
    case "create-container":
      await cc.createIfNotExists();
      break;
    case "put": {
      const b = cc.getBlockBlobClient(blob);
      await b.upload(content, Buffer.byteLength(content));
      break;
    }
    case "list":
      for await (const item of cc.listBlobsFlat()) console.log(item.name);
      break;
    case "get": {
      const r = await cc.getBlockBlobClient(blob).download();
      process.stdout.write(await streamToString(r.readableStreamBody));
      break;
    }
    case "props": {
      const p = await cc.getBlockBlobClient(blob).getProperties();
      console.log(JSON.stringify({
        cacheControl: p.cacheControl,
        contentType: p.contentType,
        contentLanguage: p.contentLanguage,
        contentDisposition: p.contentDisposition,
        contentEncoding: p.contentEncoding,
      }));
      break;
    }
    default:
      throw new Error("unknown command " + cmd);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
