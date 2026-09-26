// Genera types/api.d.ts a partir del OpenAPI del backend.
//
// Por qué existe este script en vez de llamar a `openapi-typescript <url>`:
// el backend en desarrollo redirige http -> https (UseHttpsRedirection) con el
// certificado autofirmado de `dotnet dev-certs`, y openapi-typescript no tiene
// opción para ignorarlo. Aquí se descarga el JSON tolerando ese certificado
// (SOLO en este proceso, SOLO para desarrollo local) y se pasa el schema ya
// parseado a openapi-typescript, que así no hace ninguna petición de red.
//
// Uso: node scripts/gen-api.mjs [url] [out]
//   url por defecto: http://localhost:5243/openapi/v1.json (o $OPENAPI_URL)
//   out por defecto: types/api.d.ts
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
