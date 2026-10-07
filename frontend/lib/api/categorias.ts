import type {
  CategoriaDto,
  CreateCategoriaCommand,
  UpdateCategoriaCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";

export function getCategorias(): Promise<CategoriaDto[]> {
  return apiFetch<CategoriaDto[]>("/api/v1/Categorias");
}

export function getCategoriaById(id: string): Promise<CategoriaDto> {
  return apiFetch<CategoriaDto>(`/api/v1/Categorias/${id}`);
}

export function createCategoria(
  cmd: CreateCategoriaCommand,
): Promise<CategoriaDto> {
  return apiPost<CategoriaDto>("/api/v1/Categorias", cmd);
}

export function updateCategoria(
  id: string,
  cmd: UpdateCategoriaCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/Categorias/${id}`, cmd);
}

export function deleteCategoria(id: string): Promise<void> {
  return apiDelete(`/api/v1/Categorias/${id}`);
}
