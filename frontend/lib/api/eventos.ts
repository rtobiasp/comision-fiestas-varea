import type {
  CreateEventoCommand,
  EventoDto,
  UpdateEventoCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";
import { toPageParams, type PageQuery } from "./page-query";

export function createEvento(cmd: CreateEventoCommand): Promise<EventoDto> {
  return apiPost<EventoDto>("/api/v1/Eventos", cmd);
}

export function getEventoById(id: string): Promise<EventoDto> {
  return apiFetch<EventoDto>(`/api/v1/Eventos/${id}`);
}

export function updateEvento(
  id: string,
  cmd: UpdateEventoCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/Eventos/${id}`, cmd);
}

export type EventosQuery = PageQuery;

export function getEventos(
  offset: number,
  limit: number,
  query?: Pick<EventosQuery, "orderBy" | "direction" | "publicada">,
): Promise<EventoDto[]> {
  const params = toPageParams({ offset, limit, ...query });
  return apiFetch<EventoDto[]>(`/api/v1/Eventos?${params.toString()}`);
}

export function deleteEvento(id: string): Promise<void> {
  return apiDelete(`/api/v1/Eventos/${id}`);
}
