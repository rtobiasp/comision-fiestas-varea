import { MediaDto } from "@/types";
import { apiDelete, apiFetch } from "./client";

export async function getAllMedias(): Promise<MediaDto[]> {
  return await apiFetch<MediaDto[]>("/api/v1/Media");
}

export async function deleteMedia(id: string) {
  await apiDelete(`/api/v1/Media/${id}`);
}
