import type {
  CreateTagCommand,
  TagDto,
  UpdateTagCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";

export function getTags(search?: string): Promise<TagDto[]> {
  const params = new URLSearchParams();
  if (search?.trim()) params.set("search", search.trim());
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return apiFetch<TagDto[]>(`/api/v1/Tags${query}`);
}

export function getTagById(id: string): Promise<TagDto> {
  return apiFetch<TagDto>(`/api/v1/Tags/${id}`);
}

export function createTag(cmd: CreateTagCommand): Promise<TagDto> {
  return apiPost<TagDto>("/api/v1/Tags", cmd);
}

export function updateTag(id: string, cmd: UpdateTagCommand): Promise<void> {
  return apiPut<void>(`/api/v1/Tags/${id}`, cmd);
}

export function deleteTag(id: string): Promise<void> {
  return apiDelete(`/api/v1/Tags/${id}`);
}
