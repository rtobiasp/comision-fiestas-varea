export function withParams(
  base: string,
  pathname: string,
  next: Record<string, string | null>,
) {
  const params = new URLSearchParams(base);
  for (const [key, value] of Object.entries(next)) {
    if (value == null) params.delete(key);
    else params.set(key, value);
  }
  params.set("page", "1");
  return `${pathname}?${params.toString()}`;
}

export function estadoLinkClass(active: boolean) {
  return active
    ? "font-medium text-foreground"
    : "text-primary underline-offset-4 hover:underline";
}
