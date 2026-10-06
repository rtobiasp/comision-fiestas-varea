import { ApiError } from "./client";

export type FormErrorState = {
  ok: false;
  message: string;
  fieldErrors: Record<string, string[]>;
};

export function isRedirectError(e: unknown): boolean {
  return (
    e instanceof Error &&
    "digest" in e &&
    typeof (e as { digest?: unknown }).digest === "string" &&
    ((e as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
      (e as { digest: string }).digest.startsWith("NEXT_NOT_FOUND"))
  );
}

export function toFormError(e: unknown): Omit<FormErrorState, "ok"> {
  if (e instanceof ApiError) {
    const fieldErrors: Record<string, string[]> = {};
    for (const [key, value] of Object.entries(e.fieldErrors)) {
      fieldErrors[key.toLowerCase()] = value;
    }
    return { message: e.message, fieldErrors };
  }
  if (e instanceof Error) {
    return { message: e.message, fieldErrors: {} };
  }
  return { message: "Ha ocurrido un error inesperado.", fieldErrors: {} };
}
