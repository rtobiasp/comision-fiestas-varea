import {
  CreateNotificacionCommand,
  NotificacionDto,
  UpdateNotificacionCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";

const API_BASE = "/api/v1/Notificaciones";

export async function getAllNotificaciones(
  offset: number,
  limit: number,
): Promise<NotificacionDto[]> {
  return await apiFetch<NotificacionDto[]>(
    `${API_BASE}?offset=${offset}&limit=${limit}`,
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
