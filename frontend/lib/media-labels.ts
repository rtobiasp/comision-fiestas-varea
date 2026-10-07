import { MediaTipo } from "@/types";

export const MEDIA_PAGE_SIZE = 24;
export const ALL_TIPOS = [MediaTipo.Imagen, MediaTipo.Pdf, MediaTipo.Video];

const plural: Record<number, string> = {
  [MediaTipo.Imagen]: "Imágenes",
  [MediaTipo.Pdf]: "PDF",
  [MediaTipo.Video]: "Vídeos",
};

const singular: Record<number, string> = {
  [MediaTipo.Imagen]: "Imagen",
  [MediaTipo.Pdf]: "PDF",
  [MediaTipo.Video]: "Vídeo",
};

export function tipoLabelPlural(tipo: MediaTipo): string {
  return plural[tipo] ?? "Archivos";
}

export function tipoLabelSingular(tipo: MediaTipo): string {
  return singular[tipo] ?? "Archivo";
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

export function acceptFor(allowed: MediaTipo[]): string {
  if (allowed.includes(MediaTipo.Imagen) && allowed.length === 1)
    return "image/*";
  const parts: string[] = [];
  if (allowed.includes(MediaTipo.Imagen)) parts.push("image/*");
  if (allowed.includes(MediaTipo.Pdf)) parts.push("application/pdf");
  if (allowed.includes(MediaTipo.Video)) parts.push("video/*");
  return parts.join(",");
}

export function matchMediaByUrl(
  items: { id: string; url: string }[],
  valueUrl: string | null | undefined,
): string | null {
  if (!valueUrl) return null;
  const found = items.find((m) => m.url === valueUrl);
  return found?.id ?? null;
}
