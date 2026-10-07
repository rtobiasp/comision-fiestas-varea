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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CategoriaDto } from "@/types";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import { preventEnterSubmit, validarNombre } from "./form-helpers";

export type CategoriaFormInitial = {
  nombre: string;
  descripcion: string | null;
  categoriaPadreId: string | null;
};

const SIN_PADRE = "__sin_padre__";

type CategoriaFormProps = {
  categorias: CategoriaDto[];
  initial?: CategoriaFormInitial;
  excludeId?: string;
  mode?: "create" | "edit";
  onSubmit: (formData: FormData) => Promise<void>;
};

export default function CategoriaForm({
  categorias,
  initial,
  excludeId,
  mode = "create",
  onSubmit,
}: CategoriaFormProps) {
  const isEdit = mode === "edit";
  const [nombreLen, setNombreLen] = useState(initial?.nombre.length ?? 0);
  const [descripcionLen, setDescripcionLen] = useState(
    initial?.descripcion?.length ?? 0,
  );
  const [padre, setPadre] = useState<string>(
    initial?.categoriaPadreId ?? SIN_PADRE,
  );
  const candidatas = categorias.filter((c) => c.id !== excludeId);

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const nombre = String(formData.get("nombre") ?? "");
      const descripcion = String(formData.get("descripcion") ?? "");
      const nombreErrors = validarNombre(nombre, 100);
      if (nombreErrors) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: nombreErrors,
        };
      }
      if (descripcion.length > 250) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: {
            descripcion: [
              "La descripción no puede exceder los 250 caracteres.",
            ],
          },
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
  const descripcionErrors = fieldErrors.descripcion ?? [];
  const padreErrors =
    fieldErrors.categoriapadreid ?? fieldErrors.categoriaPadreId ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) =>
      !["nombre", "descripcion", "categoriapadreid", "categoriaPadreId"].includes(
        key,
      ),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Editar categoría" : "Añadir categoría"}
      </h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            {isEdit
              ? "No se ha podido guardar la categoría"
              : "No se ha podido crear la categoría"}
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
                placeholder="Nombre de la categoría"
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

            <div className="grid gap-2">
              <Label htmlFor="descripcion">
                Descripción{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="descripcion"
                name="descripcion"
                maxLength={250}
                placeholder="Descripción opcional"
                defaultValue={initial?.descripcion ?? ""}
                aria-invalid={descripcionErrors.length > 0}
                aria-describedby={`descripcion-count${descripcionErrors.length > 0 ? " descripcion-error" : ""}`}
                onChange={(e) => {
                  setDescripcionLen(e.target.value.length);
                }}
                readOnly={isPending}
              />
              <div className="flex justify-end">
                <p
                  id="descripcion-count"
                  className={`text-xs ${descripcionLen > 250 ? "text-destructive" : "text-muted-foreground"}`}
                >
                  {descripcionLen}/250
                </p>
              </div>
              {descripcionErrors.length > 0 && (
                <div id="descripcion-error">
                  {descripcionErrors.map((m, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="categoriaPadreId">
                Categoría padre{" "}
                <span className="font-normal text-muted-foreground">
                  (opcional)
                </span>
              </Label>
              <input
                type="hidden"
                name="categoriaPadreId"
                value={padre === SIN_PADRE ? "" : padre}
              />
              <Select
                value={padre}
                onValueChange={(v) => setPadre(v ?? SIN_PADRE)}
                disabled={isPending}
              >
                <SelectTrigger id="categoriaPadreId" aria-invalid={padreErrors.length > 0}>
                  <SelectValue placeholder="Sin padre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SIN_PADRE}>Sin padre</SelectItem>
                  {candidatas.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {padreErrors.length > 0 && (
                <div>
                  {padreErrors.map((m, i) => (
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
                href="/admin/categorias"
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
