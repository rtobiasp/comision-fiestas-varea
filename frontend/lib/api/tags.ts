import type { CreateTagCommand, TagDto } from "@/types";
import { apiFetch, apiPost } from "./client";

export async function getTags(): Promise<TagDto[]> {
  return await apiFetch<TagDto[]>("/api/v1/Tags");
}

export function createTag(cmd: CreateTagCommand): Promise<TagDto> {
  return apiPost<TagDto>("/api/v1/Tags", cmd);
}
