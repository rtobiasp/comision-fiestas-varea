import { MediaDto, UploadMediaData } from "@/types";
import { apiDelete, apiFetch } from "./client";

export async function getAllMedias(): Promise<MediaDto[]> {
  return await apiFetch<MediaDto[]>("/api/v1/Media");
}

export async function deleteMedia(id: string) {
  await apiDelete(`/api/v1/Media/${id}`);
}

export async function uploadMedia(cmd: UploadMediaData): Promise<MediaDto> {
  const form = new FormData();
  form.append("file", cmd.file);
  if (cmd.altText !== undefined && cmd.altText.trim() !== "") {
    form.append("altText", cmd.altText);
  }

  return await apiFetch<MediaDto>("/api/v1/Media/upload", {
    method: "POST",
    body: form,
  });
}
