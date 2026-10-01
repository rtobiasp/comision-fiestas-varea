import { MediaDto, UploadMediaData } from "@/types";
import { apiDelete, apiFetch, apiPost } from "./client";

export async function getAllMedias(): Promise<MediaDto[]> {
  return await apiFetch<MediaDto[]>("/api/v1/Media");
}

export async function deleteMedia(id: string) {
  await apiDelete(`/api/v1/Media/${id}`);
}

export async function uploadMedia(cmd: UploadMediaData): Promise<MediaDto> {
  return await apiPost("/api/v1/Media/upload", cmd);
}
