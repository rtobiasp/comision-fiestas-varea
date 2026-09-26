import { TagDto } from "@/types";
import { apiFetch } from "./client";

export async function getTags(): Promise<TagDto[]> {
  return await apiFetch<TagDto[]>("/api/v1/Tags");
}
