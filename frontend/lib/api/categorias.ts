import type { CategoriaDto } from "@/types";
import { apiFetch } from "./client";

export function getCategorias(): Promise<CategoriaDto[]> {
  return apiFetch<CategoriaDto[]>("/api/v1/Categorias");
}
