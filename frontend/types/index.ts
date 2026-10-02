import type { components, paths } from "./api";

export enum MediaTipo {
  Imagen = 0,
  Pdf = 1,
  Video = 2,
}

// Alias convenientes sobre los schemas generados desde OpenAPI.
// Este archivo SÍ es manual; types/api.d.ts es generado (pnpm gen:api) y no debe editarse.
export type NoticiaDto = components["schemas"]["NoticiaDto"];
export type CategoriaDto = components["schemas"]["CategoriaDto"];
export type CategoriaResumenDto = components["schemas"]["CategoriaResumenDto"];
export type TagDto = components["schemas"]["TagDto"];
export type TagResumenDto = components["schemas"]["TagResumenDto"];
export type MediaDto = components["schemas"]["MediaDto"];

export type CreateNoticiaCommand =
  components["schemas"]["CreateNoticiaCommand"];
export type UpdateNoticiaCommand =
  components["schemas"]["UpdateNoticiaCommand"];
export type CreateCategoriaCommand =
  components["schemas"]["CreateCategoriaCommand"];
export type UpdateCategoriaCommand =
  components["schemas"]["UpdateCategoriaCommand"];
export type CreateTagCommand = components["schemas"]["CreateTagCommand"];
export type UpdateTagCommand = components["schemas"]["UpdateTagCommand"];
export type UploadMediaData = {
  file: File;
  altText?: string;
};

export type UpdateMediaCommand = {
  nombreOriginal: string;
  altText?: string | null;
};

export type ApiPaths = paths;
