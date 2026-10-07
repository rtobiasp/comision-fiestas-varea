import type {
  CreateNoticiaCommand,
  NoticiaDto,
  UpdateNoticiaCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";
import { toPageParams, type PageQuery } from "./page-query";

export function createNoticia(cmd: CreateNoticiaCommand): Promise<NoticiaDto> {
  return apiPost<NoticiaDto>("/api/v1/Noticias", cmd);
}

export function getNoticiaById(id: string): Promise<NoticiaDto> {
  return apiFetch<NoticiaDto>(`/api/v1/Noticias/${id}`);
}

export function updateNoticia(
  id: string,
  cmd: UpdateNoticiaCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/Noticias/${id}`, cmd);
}

export type NoticiasQuery = PageQuery;

export function getNoticias(
  offset: number,
  limit: number,
  query?: Pick<NoticiasQuery, "orderBy" | "direction" | "publicada">,
): Promise<NoticiaDto[]> {
  const params = toPageParams({ offset, limit, ...query });
  return apiFetch<NoticiaDto[]>(`/api/v1/Noticias?${params.toString()}`);
}

export function deleteNoticia(id: string): Promise<void> {
  return apiDelete(`/api/v1/Noticias/${id}`);
}
