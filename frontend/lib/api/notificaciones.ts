import {
  CreateNotificacionCommand,
  NotificacionDto,
  UpdateNotificacionCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";

const API_BASE = "/api/v1/Notificaciones";

export type NotificacionesQuery = {
  offset: number;
  limit: number;
  orderBy?: string;
  direction?: string;
  publicada?: boolean;
};

export async function getAllNotificaciones(
  offset: number,
  limit: number,
  query?: Pick<NotificacionesQuery, "orderBy" | "direction" | "publicada">,
): Promise<NotificacionDto[]> {
  const params = new URLSearchParams({
    offset: String(offset),
    limit: String(limit),
  });
  if (query?.orderBy) params.set("orderBy", query.orderBy);
  if (query?.direction) params.set("direction", query.direction);
  if (query?.publicada !== undefined)
    params.set("publicada", String(query.publicada));
  return await apiFetch<NotificacionDto[]>(
    `${API_BASE}?${params.toString()}`,
  );
}

export async function getNotificacionById(
  id: string,
): Promise<NotificacionDto | null> {
  return await apiFetch(`${API_BASE}/${id}`);
}

export async function deleteNotificacion(id: string) {
  return await apiDelete(`${API_BASE}/${id}`);
}

export async function createNotificacion(
  cmd: CreateNotificacionCommand,
): Promise<NotificacionDto> {
  return await apiPost(`${API_BASE}`, cmd);
}

export async function updateNotificacion(
  id: string,
  cmd: UpdateNotificacionCommand,
): Promise<void> {
  await apiPut(`${API_BASE}/${id}`, cmd);
}
