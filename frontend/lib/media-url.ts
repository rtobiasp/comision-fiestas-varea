export function getMediaAbsoluteUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}
