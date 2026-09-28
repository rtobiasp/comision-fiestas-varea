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
  initial,
  mode = "create",
  title,
  onSubmit,
  onCreateCategoria,
  onCreateTag,
}: {
  categorias: CategoriaDto[];
  tags: TagDto[];
  initial?: NoticiaFormInitial;
  mode?: "create" | "edit";
  title?: string;
  onSubmit: (formData: FormData) => Promise<void>;
  onCreateCategoria: (formData: FormData) => void | Promise<void>;
  onCreateTag: (formData: FormData) => void | Promise<void>;
}) {
  const isEdit = mode === "edit";
  const [contenido, setContenido] = useState(initial?.contenido ?? "");
  const heading = title ?? (isEdit ? "Editar noticia" : "Añadir noticia");
  const selectedCategoriaIds = new Set(initial?.categoriaIds ?? []);

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
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
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) => !["titulo", "subtitulo", "contenido"].includes(key),
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
              className="h-12 text-xl font-medium"
            />
            {tituloErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
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
            />
            {subtituloErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="contenido">Contenido *</Label>
            <Tiptap content={contenido} onChange={setContenido} />
            <Input type="hidden" name="contenido" value={contenido} />
            {contenidoErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? "Guardar" : "Publicar"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
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
                >
                  {isEdit ? "Guardar" : "Publicar"}
                </Button>
                <Button
                  type="submit"
                  form="noticia-form"
                  name="accion"
                  value="borrador"
                  variant="outline"
                >
                  Guardar como borrador
                </Button>
              </div>
            </CardContent>
          </Card>

          <CategoriasCardForm
            categorias={categorias}
            selectedCategoriaIds={selectedCategoriaIds}
            onCreateCategoria={onCreateCategoria}
          />

          <TagsCardForm
            tags={tags}
            initialSelectedTagIds={initial?.tagIds ?? []}
            onCreateTag={onCreateTag}
          />
        </div>
      </form>
    </div>
  );
}
