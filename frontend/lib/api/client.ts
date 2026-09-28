const baseUrl =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, init);
  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path: string): Promise<void> {
  return apiFetch<void>(path, { method: "DELETE" });
}
