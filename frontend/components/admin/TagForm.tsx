"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import { preventEnterSubmit, validarNombre } from "./form-helpers";

type TagFormProps = {
  initial?: { nombre: string };
  mode?: "create" | "edit";
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function TagForm({
  initial,
  mode = "create",
  onSubmit,
}: TagFormProps) {
  const isEdit = mode === "edit";
  const [nombreLen, setNombreLen] = useState(initial?.nombre.length ?? 0);

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const nombre = String(formData.get("nombre") ?? "");
      const nombreErrors = validarNombre(nombre, 100);
      if (nombreErrors) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: nombreErrors,
        };
      }
      try {
        await onSubmit(formData);
        return { ok: true };
      } catch (e) {
        if (isRedirectError(e)) throw e;
        return { ok: false, ...toFormError(e) };
      }
    },
    null,
  );

  const fieldErrors =
    submitState !== null && !submitState.ok ? submitState.fieldErrors : {};
  const nombreErrors = fieldErrors.nombre ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) => key !== "nombre",
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Editar tag" : "Añadir tag"}
      </h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {isEdit
              ? "No se ha podido guardar el tag"
              : "No se ha podido crear el tag"}
          </AlertTitle>
          <AlertDescription>
            <p>{submitState.message}</p>
            {otherErrors.length > 0 && (
              <ul className="mt-1 list-disc pl-5">
                {otherErrors.map(([key, messages]) =>
                  messages.map((m, i) => (
                    <li key={`${key}-${i}`}>
                      {key}: {m}
                    </li>
                  )),
                )}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}
      <form action={formAction} aria-busy={isPending} className="grid gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                type="text"
                id="nombre"
                name="nombre"
                required
                maxLength={100}
                placeholder="Nombre del tag"
                defaultValue={initial?.nombre ?? ""}
                aria-invalid={nombreErrors.length > 0}
                aria-describedby={`nombre-count${nombreErrors.length > 0 ? " nombre-error" : ""}`}
                onKeyDown={preventEnterSubmit}
                onChange={(e) => {
                  setNombreLen(e.target.value.length);
                }}
                readOnly={isPending}
              />
              <div className="flex justify-end">
                <p
                  id="nombre-count"
                  className={`text-xs ${nombreLen > 100 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {nombreLen}/100
                </p>
              </div>
              {nombreErrors.length > 0 && (
                <div id="nombre-error">
                  {nombreErrors.map((m, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Guardando…"
                    : "Creando…"
                  : isEdit
                    ? "Guardar"
                    : "Crear"}
              </Button>
              <Link
                href="/admin/tags"
                className={buttonVariants({ variant: "outline" })}
                aria-disabled={isPending}
              >
                Cancelar
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
