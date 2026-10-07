import { ApiError, type ApiFieldErrors } from "./client";
import { isRedirectError } from "@/lib/navigation";

export type FormErrorState = {
  ok: false;
  message: string;
  fieldErrors: ApiFieldErrors;
};

export { isRedirectError };

export function toFormError(e: unknown): Omit<FormErrorState, "ok"> {
  if (e instanceof ApiError) {
    const fieldErrors: ApiFieldErrors = {};
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
