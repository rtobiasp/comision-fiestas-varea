import type { components, paths } from "./api";

export enum MediaTipo {
  Imagen = 0,
  Pdf = 1,
  Video = 2,
}

export type NoticiaDto = components["schemas"]["NoticiaDto"];
export type CategoriaDto = components["schemas"]["CategoriaDto"];
export type CategoriaResumenDto = components["schemas"]["CategoriaResumenDto"];
export type TagDto = components["schemas"]["TagDto"];
export type TagResumenDto = components["schemas"]["TagResumenDto"];
export type MediaDto = components["schemas"]["MediaDto"];
export type NotificacionDto = components["schemas"]["NotificacionDto"];

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
export type CreateNotificacionCommand =
  components["schemas"]["CreateNotificacionCommand"];
export type UpdateNotificacionCommand =
  components["schemas"]["UpdateNotificacionCommand"];
export type EventoDto = components["schemas"]["EventoDto"];
export type CreateEventoCommand =
  components["schemas"]["CreateEventoCommand"];
export type UpdateEventoCommand =
  components["schemas"]["UpdateEventoCommand"];

export type ProgramacionDto = {
  id: string;
  nombre: string;
  createdAt: string;
  createdBy: string;
  lastModifiedAt: string | null;
  lastModifiedBy: string | null;
  dias: DiaProgramacionDto[];
};
export type DiaProgramacionDto = {
  id: string;
  fecha: string;
  eventos: EventoProgramacionDto[];
};
export type EventoProgramacionDto = {
  id: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
};
export type CreateProgramacionCommand = {
  nombre: string;
};
export type UpdateProgramacionCommand = {
  nombre: string;
};
export type CreateDiaProgramacionCommand = {
  programacionId: string;
  fecha: string;
};
export type UpdateDiaProgramacionCommand = {
  fecha: string;
};
export type CreateEventoProgramacionCommand = {
  diaId: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
};
export type UpdateEventoProgramacionCommand = {
  nombre: string;
  descripcion: string;
  fechaInicio: string;
};

export type ApiPaths = paths;
