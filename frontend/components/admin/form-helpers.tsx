import type { KeyboardEvent } from "react";

export function preventEnterSubmit(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key === "Enter" && !e.nativeEvent.isComposing) {
    e.preventDefault();
  }
}

export function validarNombre(
  nombre: string,
  max = 100,
): Record<string, string[]> | null {
  if (nombre.trim() === "") {
    return {
      nombre: ["El nombre no puede estar vacío ni contener solo espacios."],
    };
  }
  if (nombre.length > max) {
    return {
      nombre: [`El nombre no puede exceder los ${max} caracteres.`],
    };
  }
  return null;
}

export function FormErrors({ errors }: { errors: [string, string[]][] }) {
  if (errors.length === 0) return null;
  return (
    <ul className="mt-1 list-disc pl-5">
      {errors.map(([key, messages]) =>
        messages.map((m, i) => (
          <li key={`${key}-${i}`}>
            {key}: {m}
          </li>
        )),
      )}
    </ul>
  );
}
