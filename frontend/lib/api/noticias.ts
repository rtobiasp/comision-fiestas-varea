import type { CreateNoticiaCommand, NoticiaDto } from "@/types";
import { apiDelete, apiFetch, apiPost } from "./client";

export function createNoticia(cmd: CreateNoticiaCommand): Promise<NoticiaDto> {
  return apiPost<NoticiaDto>("/api/v1/Noticias", cmd);
}

export function getNoticias(): Promise<NoticiaDto[]> {
  return apiFetch<NoticiaDto[]>("/api/v1/Noticias");
}

export function deleteNoticia(id: string) {
  return apiDelete(`/api/v1/Noticias/${id}`);
}
