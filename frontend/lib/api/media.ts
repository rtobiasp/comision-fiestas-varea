import type {
  MediaDto,
  MediaTipo,
  UpdateMediaCommand,
  UploadMediaData,
} from "@/types";
import { apiDelete, apiFetch, apiPut } from "./client";

const BASE_URL = "/api/v1/Media";

export function getAllMedias(
  tipo?: MediaTipo,
  offset?: number,
  limit?: number,
): Promise<MediaDto[]> {
  const params = new URLSearchParams();
  if (tipo !== undefined) params.set("tipo", String(tipo));
  if (offset !== undefined) params.set("offset", String(offset));
  if (limit !== undefined) params.set("limit", String(limit));
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiFetch<MediaDto[]>(`${BASE_URL}${query}`);
}

export function deleteMedia(id: string): Promise<void> {
  return apiDelete(`${BASE_URL}/${id}`);
}

export function uploadMedia(cmd: UploadMediaData): Promise<MediaDto> {
  const form = new FormData();
  form.append("file", cmd.file);
  if (cmd.altText !== undefined && cmd.altText.trim() !== "") {
    form.append("altText", cmd.altText);
  }

  return apiFetch<MediaDto>(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });
}

export function updateMedia(
  id: string,
  cmd: UpdateMediaCommand,
): Promise<void> {
  return apiPut<void>(`${BASE_URL}/${id}`, cmd);
}
