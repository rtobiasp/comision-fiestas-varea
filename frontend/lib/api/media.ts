import { MediaDto, MediaTipo, UploadMediaData } from "@/types";
import { apiDelete, apiFetch } from "./client";

const BASE_URL = "/api/v1/Media";

export async function getAllMedias(
  tipo?: MediaTipo,
  offset?: number,
  limit?: number,
): Promise<MediaDto[]> {
  const params = new URLSearchParams();
  if (tipo !== undefined) params.set("tipo", String(tipo));
  if (offset !== undefined) params.set("offset", String(offset));
  if (limit !== undefined) params.set("limit", String(limit));
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return await apiFetch<MediaDto[]>(`${BASE_URL}${query}`);
}

export async function deleteMedia(id: string) {
  await apiDelete(`${BASE_URL}/${id}`);
}

export async function uploadMedia(cmd: UploadMediaData): Promise<MediaDto> {
  const form = new FormData();
  form.append("file", cmd.file);
  if (cmd.altText !== undefined && cmd.altText.trim() !== "") {
    form.append("altText", cmd.altText);
  }

  return await apiFetch<MediaDto>(`${BASE_URL}/upload`, {
    method: "POST",
    body: form,
  });
}
