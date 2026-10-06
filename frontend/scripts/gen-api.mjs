process.env.NODE_TLS_REJECT_UNAUTHORIZED ??= "0";

import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import openapiTS, { astToString } from "openapi-typescript";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const url =
  process.argv[2] ?? process.env.OPENAPI_URL ?? "http://localhost:5243/openapi/v1.json";
const out = resolve(root, process.argv[3] ?? "types/api.d.ts");

const res = await fetch(url);
if (!res.ok) {
  throw new Error(`GET ${url} -> ${res.status} ${res.statusText}`);
}
const schema = await res.json();

const ast = await openapiTS(schema);
const header = `/**\n * Generado con \`pnpm gen:api\` desde ${url}.\n * No editar a mano.\n */\n`;
await mkdir(dirname(out), { recursive: true });
await writeFile(out, header + astToString(ast));
console.log(`OK ${url} -> ${out}`);
