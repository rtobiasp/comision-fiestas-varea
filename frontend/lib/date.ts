export function parseOptionalDateTimeLocalToIso(raw: string): string | null {
  const value = raw.trim();
  if (value === "") return null;
  const time = Date.parse(value);
  if (Number.isNaN(time)) throw new Error("La fecha de caducidad no es válida.");
  return new Date(time).toISOString();
}
