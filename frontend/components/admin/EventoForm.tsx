"use client";

import { useActionState, useState } from "react";
import { TriangleAlert } from "lucide-react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoriaDto, TagDto } from "@/types";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import { FormErrors, preventEnterSubmit } from "./form-helpers";
import { useTaxonomyManager } from "./useTaxonomyManager";
import CategoriasCardForm from "./CategoriasCardForm";
import PortadaCardForm from "./PortadaCardForm";
import TagsCardForm from "./TagsCardForm";

export type EventoFormInitial = {
  titulo: string;
  descripcion: string;
  lugar: string;
  fechaInicio: string | null;
  fechaFin: string | null;
  aforo: number | string | null;
  imagenPortada: string | null;
  fijada: boolean;
  categoriaIds: string[];
  tagIds: string[];
};

export default function EventoForm({
  categorias,
  tags,
  categoriasError = false,
  tagsError = false,
  initial,
  mode = "create",
  title,
  onSubmit,
  onCreateCategoria,
  onCreateTag,
}: {
  categorias: CategoriaDto[];
  tags: TagDto[];
  categoriasError?: boolean;
  tagsError?: boolean;
  initial?: EventoFormInitial;
  mode?: "create" | "edit";
  title?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCreateCategoria: (formData: FormData) => Promise<CategoriaDto>;
  onCreateTag: (formData: FormData) => Promise<TagDto>;
}) {
  const isEdit = mode === "edit";
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? "");
  const [tituloLen, setTituloLen] = useState(initial?.titulo.length ?? 0);
  const [lugarLen, setLugarLen] = useState(initial?.lugar.length ?? 0);
  const heading = title ?? (isEdit ? "Editar evento" : "Añadir evento");
  const selectedCategoriaIds = new Set(initial?.categoriaIds ?? []);

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const titulo = String(formData.get("titulo") ?? "");
      const lugar = String(formData.get("lugar") ?? "");
      const descripcionValue = String(formData.get("descripcion") ?? "");
      const fechaInicio = String(formData.get("fechaInicio") ?? "");
      const fechaFin = String(formData.get("fechaFin") ?? "");
      const aforoRaw = String(formData.get("aforo") ?? "").trim();
      const fieldErrors: Record<string, string[]> = {};
      if (titulo.trim() === "") {
        fieldErrors.titulo = [
          "El título no puede estar vacío ni contener solo espacios.",
        ];
      } else if (titulo.length > 200) {
        fieldErrors.titulo = ["El título no puede exceder los 200 caracteres."];
      }
      if (lugar.trim() === "") {
        fieldErrors.lugar = [
          "El lugar no puede estar vacío ni contener solo espacios.",
        ];
      } else if (lugar.length > 200) {
        fieldErrors.lugar = ["El lugar no puede exceder los 200 caracteres."];
      }
      if (descripcionValue.length > 100000) {
        fieldErrors.descripcion = [
          "La descripción no puede exceder los 100000 caracteres.",
        ];
      }
      if (fechaInicio.trim() === "") {
        fieldErrors.fechainicio = ["La fecha de inicio es obligatoria."];
      }
      if (fechaInicio.trim() !== "" && fechaFin.trim() !== "") {
        const inicio = Date.parse(fechaInicio);
        const fin = Date.parse(fechaFin);
        if (!Number.isNaN(inicio) && !Number.isNaN(fin) && fin < inicio) {
          fieldErrors.fechafin = [
            "La fecha de fin no puede ser anterior a la fecha de inicio.",
          ];
        }
      }
      if (aforoRaw !== "") {
        const aforo = Number(aforoRaw);
        if (!Number.isInteger(aforo) || aforo <= 0) {
          fieldErrors.aforo = ["El aforo debe ser un número entero mayor que cero."];
        }
      }
      if (Object.keys(fieldErrors).length > 0) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors,
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

  const {
    visibleCategorias,
    visibleTags,
    categoriasFailed,
    tagsFailed,
    retryingCategorias,
    retryingTags,
    handleRetryCategorias,
    handleRetryTags,
    appendCategoria,
    appendTag,
  } = useTaxonomyManager(
    categorias,
    tags,
    categoriasError,
    tagsError,
    isPending,
  );

  async function handleCreateCategoria(
    formData: FormData,
  ): Promise<CategoriaDto> {
    const created = await onCreateCategoria(formData);
    appendCategoria(created);
    return created;
  }

  async function handleCreateTag(formData: FormData): Promise<TagDto> {
    const created = await onCreateTag(formData);
    appendTag(created);
    return created;
  }

  const fieldErrors =
    submitState !== null && !submitState.ok ? submitState.fieldErrors : {};
  const tituloErrors = fieldErrors.titulo ?? [];
  const lugarErrors = fieldErrors.lugar ?? [];
  const descripcionErrors = fieldErrors.descripcion ?? [];
  const fechaInicioErrors = fieldErrors.fechainicio ?? [];
  const fechaFinErrors = fieldErrors.fechafin ?? [];
  const aforoErrors = fieldErrors.aforo ?? [];
  const portadaErrors =
    fieldErrors.imagenportada ?? fieldErrors.imagenPortada ?? [];
  const categoriaErrors = fieldErrors.categoriaids ?? [];
  const tagErrors = fieldErrors.tagids ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) =>
      ![
        "titulo",
        "lugar",
        "descripcion",
        "fechainicio",
        "fechafin",
        "aforo",
        "imagenportada",
        "imagenPortada",
        "categoriaids",
        "tagids",
      ].includes(key),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">{heading}</h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se ha podido guardar el evento</AlertTitle>
          <AlertDescription>
            <p>{submitState.message}</p>
            <FormErrors errors={otherErrors} />
          </AlertDescription>
        </Alert>
      )}
      <form
        id="evento-form"
        action={formAction}
        aria-busy={isPending}
        className="grid items-start gap-4 lg:grid-cols-[1fr_300px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              type="text"
              id="titulo"
              name="titulo"
              required
              maxLength={200}
              placeholder="Añade un título"
              defaultValue={initial?.titulo ?? ""}
              aria-invalid={tituloErrors.length > 0}
              aria-describedby={`titulo-count${tituloErrors.length > 0 ? " titulo-error" : ""}`}
              onKeyDown={preventEnterSubmit}
              onChange={(e) => setTituloLen(e.target.value.length)}
              readOnly={isPending}
              className="h-12 text-xl font-medium"
            />
            <div className="flex justify-end">
              <p
                id="titulo-count"
                className={`text-xs ${tituloLen > 200 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {tituloLen}/200
              </p>
            </div>
            {tituloErrors.length > 0 && (
              <div id="titulo-error">
                {tituloErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="lugar">Lugar *</Label>
            <Input
              type="text"
              id="lugar"
              name="lugar"
              required
              maxLength={200}
              placeholder="Plaza del pueblo, carpa, frontón…"
              defaultValue={initial?.lugar ?? ""}
              aria-invalid={lugarErrors.length > 0}
              aria-describedby={`lugar-count${lugarErrors.length > 0 ? " lugar-error" : ""}`}
              onKeyDown={preventEnterSubmit}
              onChange={(e) => setLugarLen(e.target.value.length)}
              readOnly={isPending}
            />
            <div className="flex justify-end">
              <p
                id="lugar-count"
                className={`text-xs ${lugarLen > 200 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {lugarLen}/200
              </p>
            </div>
            {lugarErrors.length > 0 && (
              <div id="lugar-error">
                {lugarErrors.map((m, i) => (
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
            <Tiptap
              content={descripcion}
              onChange={setDescripcion}
              editable={!isPending}
            />
            <Input type="hidden" name="descripcion" value={descripcion} />
            <div className="flex justify-end">
              <p
                id="descripcion-count"
                className={`text-xs ${descripcion.length > 100000 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {descripcion.length.toLocaleString("es-ES")} / 100.000 (incluye
                formato)
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

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="fechaInicio">Fecha de inicio *</Label>
              <Input
                type="datetime-local"
                id="fechaInicio"
                name="fechaInicio"
                required
                defaultValue={initial?.fechaInicio?.slice(0, 16) ?? ""}
                readOnly={isPending}
                aria-invalid={fechaInicioErrors.length > 0}
              />
              {fechaInicioErrors.length > 0 && (
                <div id="fechaInicio-error">
                  {fechaInicioErrors.map((m, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fechaFin">Fecha de fin</Label>
              <Input
                type="datetime-local"
                id="fechaFin"
                name="fechaFin"
                defaultValue={initial?.fechaFin?.slice(0, 16) ?? ""}
                readOnly={isPending}
                aria-invalid={fechaFinErrors.length > 0}
              />
              {fechaFinErrors.length > 0 && (
                <div id="fechaFin-error">
                  {fechaFinErrors.map((m, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {m}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="aforo">Aforo</Label>
            <Input
              type="number"
              id="aforo"
              name="aforo"
              min={1}
              step={1}
              placeholder="Opcional"
              defaultValue={initial?.aforo ?? ""}
              readOnly={isPending}
              aria-invalid={aforoErrors.length > 0}
              className="max-w-48"
            />
            {aforoErrors.length > 0 && (
              <div id="aforo-error">
                {aforoErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? "Guardar" : "Publicar"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div
                className="flex items-center gap-2"
                inert={isPending}
                aria-disabled={isPending}
              >
                <Checkbox
                  id="fijada"
                  name="fijada"
                  defaultChecked={initial?.fijada ?? false}
                />
                <Label htmlFor="fijada" className="cursor-pointer">
                  Fijado
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  form="evento-form"
                  name="accion"
                  value="guardar"
                  disabled={isPending}
                >
                  {isPending
                    ? isEdit
                      ? "Guardando…"
                      : "Publicando…"
                    : isEdit
                      ? "Guardar"
                      : "Publicar"}
                </Button>
                <Button
                  type="submit"
                  form="evento-form"
                  name="accion"
                  value="borrador"
                  variant="outline"
                  disabled={isPending}
                >
                  {isPending ? "Guardando…" : "Guardar como borrador"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <PortadaCardForm
            defaultUrl={initial?.imagenPortada ?? null}
            disabled={isPending}
            fieldErrors={portadaErrors}
          />

          <CategoriasCardForm
            categorias={visibleCategorias}
            selectedCategoriaIds={selectedCategoriaIds}
            onCreateCategoria={handleCreateCategoria}
            disabled={isPending}
            loadError={categoriasFailed}
            onRetry={handleRetryCategorias}
            retrying={retryingCategorias}
            fieldErrors={categoriaErrors}
          />

          <TagsCardForm
            key={isEdit ? "edit" : "create"}
            tags={visibleTags}
            initialSelectedTagIds={initial?.tagIds ?? []}
            onCreateTag={handleCreateTag}
            disabled={isPending}
            loadError={tagsFailed}
            onRetry={handleRetryTags}
            retrying={retryingTags}
            fieldErrors={tagErrors}
          />
        </div>
      </form>
    </div>
  );
}
