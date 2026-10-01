export function formatBytes(
  value: number | string | null | undefined,
): string {
  const bytes = typeof value === "string" ? Number(value) : (value ?? NaN);
  if (!Number.isFinite(bytes) || bytes < 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let size = bytes / 1024;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 100 ? 0 : 1)} ${units[unit]}`;
}

export function formatDuration(
  value: number | string | null | undefined,
): string {
  const total =
    typeof value === "string" ? Number(value) : (value ?? NaN);
  if (!Number.isFinite(total) || total < 0) return "-";
  const seconds = Math.round(total);
  if (seconds < 60) return `${seconds} s`;
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes} min ${rest.toString().padStart(2, "0")} s`;
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (value == null) return "-";
  return new Date(value).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
