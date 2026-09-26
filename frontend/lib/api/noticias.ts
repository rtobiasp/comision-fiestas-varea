import type { CreateNoticiaCommand, NoticiaDto } from "@/types";
import { apiPost } from "./client";

export function createNoticia(cmd: CreateNoticiaCommand): Promise<NoticiaDto> {
  return apiPost<NoticiaDto>("/api/v1/Noticias", cmd);
}
