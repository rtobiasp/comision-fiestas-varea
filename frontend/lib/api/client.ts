const baseUrl =
  typeof window === "undefined"
    ? process.env.API_INTERNAL_URL
    : process.env.NEXT_PUBLIC_API_URL;

export type ApiFieldErrors = Record<string, string[]>;

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;
  readonly body: unknown;
  readonly fieldErrors: ApiFieldErrors;

  constructor(status: number, statusText: string, body: unknown) {
    super(bodyMessage(body) ?? `${status} ${statusText}`);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
    this.body = body;
    this.fieldErrors = extractFieldErrors(body);
  }
}

function bodyMessage(body: unknown): string | null {
  if (typeof body === "string" && body.trim() !== "") return body;
  if (body !== null && typeof body === "object") {
    const b = body as Record<string, unknown>;
    if (typeof b.title === "string" && b.title.trim() !== "") {
      const detail =
        typeof b.detail === "string" && b.detail.trim() !== ""
          ? ` ${b.detail}`
          : "";
      return `${b.title}${detail}`;
    }
    if (typeof b.message === "string" && b.message.trim() !== "")
      return b.message;
  }
  return null;
}

/**
 * El backend devuelve los fallos de 3 formas:
 * 1. Array FluentValidation `[{ propertyName, errorMessage }]` (POST Categorias/Tags).
 * 2. RFC7807 `{ errors: { Campo: [...] } }` (validación automática [ApiController]).
 * 3. String plano.
 */
function extractFieldErrors(body: unknown): ApiFieldErrors {
  const out: ApiFieldErrors = {};
  const push = (key: string, msg: string) => {
    const k = key.trim();
    if (k === "" || msg.trim() === "") return;
    (out[k] ??= []).push(msg);
  };

  if (Array.isArray(body)) {
    for (const item of body) {
      if (item !== null && typeof item === "object") {
        const r = item as Record<string, unknown>;
        const msg =
          typeof r.errorMessage === "string"
            ? r.errorMessage
            : typeof r.message === "string"
              ? r.message
              : null;
        const key =
          typeof r.propertyName === "string"
            ? r.propertyName
            : typeof r.property === "string"
              ? r.property
              : typeof r.field === "string"
                ? r.field
                : "";
        if (msg) push(key === "" ? "general" : key, msg);
      } else if (typeof item === "string") {
        push("general", item);
      }
    }
    return out;
  }

  if (body !== null && typeof body === "object") {
    const b = body as Record<string, unknown>;
    const errors = b.errors;
    if (errors !== null && typeof errors === "object" && !Array.isArray(errors)) {
      for (const [key, value] of Object.entries(
        errors as Record<string, unknown>,
      )) {
        if (Array.isArray(value)) {
          for (const v of value) {
            if (typeof v === "string") push(key, v);
          }
        } else if (typeof value === "string") {
          push(key, value);
        }
      }
      return out;
    }
  }

  return out;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, init);
  if (!res.ok) {
    let body: unknown = null;
    try {
      const text = await res.text();
      body = text.trim() !== "" ? (JSON.parse(text) as unknown) : null;
    } catch {
      body = null;
    }
    throw new ApiError(res.status, res.statusText, body);
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
