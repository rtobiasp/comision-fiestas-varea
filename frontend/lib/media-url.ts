export function getMediaAbsoluteUrl(url: string): string {
  const value = url.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/$/, "");
  return `${base}${value.startsWith("/") ? value : `/${value}`}`;
}
