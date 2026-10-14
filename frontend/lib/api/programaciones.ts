import type {
  CreateDiaProgramacionCommand,
  CreateEventoProgramacionCommand,
  CreateProgramacionCommand,
  DiaProgramacionDto,
  EventoProgramacionDto,
  ProgramacionDto,
  UpdateDiaProgramacionCommand,
  UpdateEventoProgramacionCommand,
  UpdateProgramacionCommand,
} from "@/types";
import { apiDelete, apiFetch, apiPost, apiPut } from "./client";
import { toPageParams } from "./page-query";

export type ProgramacionesQuery = {
  offset: number;
  limit: number;
  orderBy?: string;
  direction?: string;
};

export function getProgramaciones(
  offset: number,
  limit: number,
  query?: Pick<ProgramacionesQuery, "orderBy" | "direction">,
): Promise<ProgramacionDto[]> {
  const params = toPageParams({ offset, limit, ...query });
  return apiFetch<ProgramacionDto[]>(`/api/v1/Programaciones?${params.toString()}`);
}

export function getProgramacionById(id: string): Promise<ProgramacionDto> {
  return apiFetch<ProgramacionDto>(`/api/v1/Programaciones/${id}`);
}

export function createProgramacion(
  cmd: CreateProgramacionCommand,
): Promise<ProgramacionDto> {
  return apiPost<ProgramacionDto>("/api/v1/Programaciones", cmd);
}

export function updateProgramacion(
  id: string,
  cmd: UpdateProgramacionCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/Programaciones/${id}`, cmd);
}

export function deleteProgramacion(id: string): Promise<void> {
  return apiDelete(`/api/v1/Programaciones/${id}`);
}

export function createDiaProgramacion(
  cmd: CreateDiaProgramacionCommand,
): Promise<DiaProgramacionDto> {
  return apiPost<DiaProgramacionDto>("/api/v1/DiasProgramacion", cmd);
}

export function updateDiaProgramacion(
  id: string,
  cmd: UpdateDiaProgramacionCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/DiasProgramacion/${id}`, cmd);
}

export function deleteDiaProgramacion(id: string): Promise<void> {
  return apiDelete(`/api/v1/DiasProgramacion/${id}`);
}

export function createEventoProgramacion(
  cmd: CreateEventoProgramacionCommand,
): Promise<EventoProgramacionDto> {
  return apiPost<EventoProgramacionDto>("/api/v1/EventosProgramacion", cmd);
}

export function updateEventoProgramacion(
  id: string,
  cmd: UpdateEventoProgramacionCommand,
): Promise<void> {
  return apiPut<void>(`/api/v1/EventosProgramacion/${id}`, cmd);
}

export function deleteEventoProgramacion(id: string): Promise<void> {
  return apiDelete(`/api/v1/EventosProgramacion/${id}`);
}
