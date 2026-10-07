import type {
  CreateNoticiaCommand,
  NoticiaDto,
  UpdateNoticiaCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";

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

export type NoticiasQuery = {
  offset: number;
  limit: number;
  orderBy?: string;
  direction?: string;
  publicada?: boolean;
};

export function getNoticias(
  offset: number,
  limit: number,
  query?: Pick<NoticiasQuery, "orderBy" | "direction" | "publicada">,
): Promise<NoticiaDto[]> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  if (query?.orderBy) params.set("orderBy", query.orderBy);
  if (query?.direction) params.set("direction", query.direction);
  if (query?.publicada !== undefined) params.set("publicada", String(query.publicada));
  return apiFetch<NoticiaDto[]>(`/api/v1/Noticias?${params.toString()}`);
}

export function deleteNoticia(id: string) {
  return apiDelete(`/api/v1/Noticias/${id}`);
}
