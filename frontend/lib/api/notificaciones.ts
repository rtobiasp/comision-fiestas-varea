import { NotificacionDto } from "@/types";
import { apiDelete, apiFetch } from "./client";

const API_BASE = "/api/v1/Notificaciones";

export async function getAllNotificaciones(): Promise<NotificacionDto[]> {
  return await apiFetch<NotificacionDto[]>(`${API_BASE}`);
}

export function deleteNotificacion(id: string) {
  return apiDelete(`${API_BASE}/${id}`);
}
