"use client";

import { useActionState, useState, type KeyboardEvent } from "react";
import { TriangleAlert } from "lucide-react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CategoriaDto, TagDto } from "@/types";
import { getCategorias } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import CategoriasCardForm from "./CategoriasCardForm";
import TagsCardForm from "./TagsCardForm";

export type NoticiaFormInitial = {
  titulo: string;
  subtitulo: string | null;
  contenido: string;
  fijada: boolean;
  categoriaIds: string[];
  tagIds: string[];
};

export default function NoticiaForm({
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
  initial?: NoticiaFormInitial;
  mode?: "create" | "edit";
  title?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCreateCategoria: (formData: FormData) => Promise<CategoriaDto>;
  onCreateTag: (formData: FormData) => Promise<TagDto>;
}) {
  const isEdit = mode === "edit";
  const [contenido, setContenido] = useState(initial?.contenido ?? "");
  const [tituloLen, setTituloLen] = useState(initial?.titulo.length ?? 0);
  const [subtituloLen, setSubtituloLen] = useState(
    initial?.subtitulo?.length ?? 0,
  );
  const heading = title ?? (isEdit ? "Editar noticia" : "Añadir noticia");
  const selectedCategoriaIds = new Set(initial?.categoriaIds ?? []);

  const [visibleCategorias, setVisibleCategorias] =
    useState<CategoriaDto[]>(categorias);
  const [visibleTags, setVisibleTags] = useState<TagDto[]>(tags);

  const [categoriasFailed, setCategoriasFailed] = useState(categoriasError);
  const [tagsFailed, setTagsFailed] = useState(tagsError);
  const [retryingCategorias, setRetryingCategorias] = useState(false);
  const [retryingTags, setRetryingTags] = useState(false);

  async function handleRetryCategorias() {
    if (retryingCategorias || isPending) return;
    setRetryingCategorias(true);
    try {
      setVisibleCategorias(await getCategorias());
      setCategoriasFailed(false);
    } catch {
      setCategoriasFailed(true);
    } finally {
      setRetryingCategorias(false);
    }
  }

  async function handleRetryTags() {
    if (retryingTags || isPending) return;
    setRetryingTags(true);
    try {
      setVisibleTags(await getTags());
      setTagsFailed(false);
    } catch {
      setTagsFailed(true);
    } finally {
      setRetryingTags(false);
    }
  }

  async function handleCreateCategoria(
    formData: FormData,
  ): Promise<CategoriaDto> {
    const created = await onCreateCategoria(formData);
    setVisibleCategorias((prev) =>
      prev.some((c) => c.id === created.id) ? prev : [...prev, created],
    );
    return created;
  }

  async function handleCreateTag(formData: FormData): Promise<TagDto> {
    const created = await onCreateTag(formData);
    setVisibleTags((prev) =>
      prev.some((t) => t.id === created.id) ? prev : [...prev, created],
    );
    return created;
  }

  function preventEnterSubmit(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
    }
  }

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const titulo = String(formData.get("titulo") ?? "");
      const contenidoValue = String(formData.get("contenido") ?? "");
      if (titulo.trim() === "") {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: {
            titulo: [
              "El título no puede estar vacío ni contener solo espacios.",
            ],
          },
        };
      }
      if (titulo.length > 200) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: {
            titulo: ["El título no puede exceder los 200 caracteres."],
          },
        };
      }
      if (contenidoValue.length > 100000) {
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors: {
            contenido: ["El contenido no puede exceder los 100000 caracteres."],
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
  const tituloErrors = fieldErrors.titulo ?? [];
  const subtituloErrors = fieldErrors.subtitulo ?? [];
  const contenidoErrors = fieldErrors.contenido ?? [];
  const categoriaErrors = fieldErrors.categoriaids ?? [];
  const tagErrors = fieldErrors.tagids ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) =>
      !["titulo", "subtitulo", "contenido", "categoriaids", "tagids"].includes(
        key,
      ),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">{heading}</h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se ha podido guardar la noticia</AlertTitle>
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
      <form
        id="noticia-form"
        action={formAction}
        aria-busy={isPending}
        className="grid items-start gap-4 lg:grid-cols-[1fr_300px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo" className="sr-only">
              Título *
            </Label>
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
            <Label htmlFor="subtitulo" className="sr-only">
              Subtítulo
            </Label>
            <Input
              type="text"
              id="subtitulo"
              name="subtitulo"
              maxLength={300}
              placeholder="Subtítulo opcional"
              defaultValue={initial?.subtitulo ?? ""}
              aria-invalid={subtituloErrors.length > 0}
              aria-describedby={`subtitulo-count${subtituloErrors.length > 0 ? " subtitulo-error" : ""}`}
              onKeyDown={preventEnterSubmit}
              onChange={(e) => setSubtituloLen(e.target.value.length)}
              readOnly={isPending}
            />
            <div className="flex justify-end">
              <p
                id="subtitulo-count"
                className={`text-xs ${subtituloLen > 300 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {subtituloLen}/300
              </p>
            </div>
            {subtituloErrors.length > 0 && (
              <div id="subtitulo-error">
                {subtituloErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contenido">
              Contenido{" "}
              <span className="font-normal text-muted-foreground">
                (opcional)
              </span>
            </Label>
            <Tiptap
              content={contenido}
              onChange={setContenido}
              editable={!isPending}
            />
            <Input type="hidden" name="contenido" value={contenido} />
            <div className="flex justify-end">
              <p
                id="contenido-count"
                className={`text-xs ${contenido.length > 100000 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {contenido.length.toLocaleString("es-ES")} / 100.000 (incluye
                formato)
              </p>
            </div>
            {contenidoErrors.length > 0 && (
              <div id="contenido-error">
                {contenidoErrors.map((m, i) => (
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
                  Fijada
                </Label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  form="noticia-form"
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
                  form="noticia-form"
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
