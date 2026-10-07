import type {
  CreateNotificacionCommand,
  NotificacionDto,
  UpdateNotificacionCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";
import { toPageParams, type PageQuery } from "./page-query";

const API_BASE = "/api/v1/Notificaciones";

export type NotificacionesQuery = PageQuery;

export function getAllNotificaciones(
  offset: number,
  limit: number,
  query?: Pick<NotificacionesQuery, "orderBy" | "direction" | "publicada">,
): Promise<NotificacionDto[]> {
  const params = toPageParams({ offset, limit, ...query });
  return apiFetch<NotificacionDto[]>(`${API_BASE}?${params.toString()}`);
}

export function getNotificacionById(id: string): Promise<NotificacionDto> {
  return apiFetch<NotificacionDto>(`${API_BASE}/${id}`);
}

export function deleteNotificacion(id: string): Promise<void> {
  return apiDelete(`${API_BASE}/${id}`);
}

export function createNotificacion(
  cmd: CreateNotificacionCommand,
): Promise<NotificacionDto> {
  return apiPost<NotificacionDto>(`${API_BASE}`, cmd);
}

export function updateNotificacion(
  id: string,
  cmd: UpdateNotificacionCommand,
): Promise<void> {
  return apiPut<void>(`${API_BASE}/${id}`, cmd);
}
