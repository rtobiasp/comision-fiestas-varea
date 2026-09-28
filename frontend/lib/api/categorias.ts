import type { CategoriaDto, CreateCategoriaCommand } from "@/types";
import { apiFetch, apiPost } from "./client";

export function getCategorias(): Promise<CategoriaDto[]> {
  return apiFetch<CategoriaDto[]>("/api/v1/Categorias");
}

export function createCategoria(
  cmd: CreateCategoriaCommand,
): Promise<CategoriaDto> {
  return apiPost<CategoriaDto>("/api/v1/Categorias", cmd);
}
