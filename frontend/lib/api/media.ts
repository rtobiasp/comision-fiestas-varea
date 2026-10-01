import { MediaDto } from "@/types";
import { apiFetch } from "./client";

export async function getAllMedias(): Promise<MediaDto[]> {
  return await apiFetch<MediaDto[]>("/api/v1/Media");
}
