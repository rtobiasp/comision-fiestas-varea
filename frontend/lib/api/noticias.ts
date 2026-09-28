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

export function getNoticias(
  offset: number,
  limit: number,
): Promise<NoticiaDto[]> {
  return apiFetch<NoticiaDto[]>(
    `/api/v1/Noticias?offset=${offset}&limit=${limit}`,
  );
}

export function deleteNoticia(id: string) {
  return apiDelete(`/api/v1/Noticias/${id}`);
}
