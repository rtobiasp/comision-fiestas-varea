"use client";

import { useActionState, useState } from "react";
import { Info, Siren, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { CategoriaDto, NotificacionDto, TagDto } from "@/types";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import { useTaxonomyManager } from "./useTaxonomyManager";
import { FormErrors } from "./form-helpers";
import CategoriasCardForm from "./CategoriasCardForm";
import TagsCardForm from "./TagsCardForm";

type NotificacionInitial = Pick<
  NotificacionDto,
  | "id"
  | "titulo"
  | "mensaje"
  | "nivel"
  | "fechaCaducidad"
  | "publicada"
  | "fijada"
> & {
  categorias?: { id: string }[];
  tags?: { id: string }[];
};

type NotificacionFormProps = {
  mode?: "create" | "edit";
  notificacion: NotificacionInitial;
  categorias: CategoriaDto[];
  tags: TagDto[];
  categoriasError?: boolean;
  tagsError?: boolean;
  onSubmit: (formData: FormData) => Promise<void>;
  onCreateCategoria: (formData: FormData) => Promise<CategoriaDto>;
  onCreateTag: (formData: FormData) => Promise<TagDto>;
};

const NIVELES = [
  {
    value: "Info",
    label: "Info",
    description: "Aviso general sin urgencia.",
    dotClassName: "bg-sky-500",
    badgeClassName:
      "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200",
    Icon: Info,
  },
  {
    value: "Aviso",
    label: "Aviso",
    description: "Requiere atención, pero no es crítico.",
    dotClassName: "bg-amber-500",
    badgeClassName:
      "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200",
    Icon: TriangleAlert,
  },
  {
    value: "Urgente",
    label: "Urgente",
    description: "Información crítica y prioritaria.",
    dotClassName: "bg-red-500",
    badgeClassName:
      "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200",
    Icon: Siren,
  },
] as const;

type NivelValue = (typeof NIVELES)[number]["value"];

function isNivelValue(value: string | null | undefined): value is NivelValue {
  return NIVELES.some((nivel) => nivel.value === value);
}

type SubmitState = { ok: true } | FormErrorState | null;

export default function NotificacionForm({
  mode = "create",
  notificacion,
  categorias,
  tags,
  categoriasError = false,
  tagsError = false,
  onSubmit,
  onCreateCategoria,
  onCreateTag,
}: NotificacionFormProps) {
  const isEdit = mode === "edit";
  const [nivel, setNivel] = useState<NivelValue>(
    isNivelValue(notificacion.nivel ?? "")
      ? (notificacion.nivel as NivelValue)
      : "Info",
  );
  const selectedCategoriaIds = new Set(
    (notificacion.categorias ?? []).map((c) => c.id),
  );
  const initialTagIds = (notificacion.tags ?? []).map((t) => t.id);

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const titulo = String(formData.get("titulo") ?? "");
      const mensaje = String(formData.get("mensaje") ?? "");
      const nivelValue = String(formData.get("nivel") ?? "");
      const fieldErrors: Record<string, string[]> = {};
      if (titulo.trim() === "") {
        fieldErrors.titulo = [
          "El título no puede estar vacío ni contener solo espacios.",
        ];
      } else if (titulo.length > 200) {
        fieldErrors.titulo = ["El título no puede exceder los 200 caracteres."];
      }
      if (mensaje.trim() === "") {
        fieldErrors.mensaje = ["El mensaje no puede estar vacío."];
      }
      if (!isNivelValue(nivelValue)) {
        fieldErrors.nivel = ["Selecciona un nivel válido."];
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

  const selectedNivel = NIVELES.find((item) => item.value === nivel) ?? NIVELES[0];
  const fieldErrors =
    submitState !== null && !submitState.ok ? submitState.fieldErrors : {};
  const tituloErrors = fieldErrors.titulo ?? [];
  const mensajeErrors = fieldErrors.mensaje ?? [];
  const nivelErrors = fieldErrors.nivel ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) => !["titulo", "mensaje", "nivel"].includes(key),
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">
        {isEdit ? "Editar notificación" : "Nueva notificación"}
      </h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se ha podido guardar la notificación</AlertTitle>
          <AlertDescription>
            <p>{submitState.message}</p>
            <FormErrors errors={otherErrors} />
          </AlertDescription>
        </Alert>
      )}
      <form
        action={formAction}
        key={notificacion.id}
        aria-busy={isPending}
        className="grid items-start gap-4 lg:grid-cols-[1fr_320px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Contenido</CardTitle>
              <CardDescription>
                Título, mensaje y nivel de importancia de la notificación.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field data-invalid={tituloErrors.length > 0}>
                <FieldLabel htmlFor="titulo">Título</FieldLabel>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="Ej. Corte de calle por las fiestas"
                  defaultValue={notificacion.titulo ?? ""}
                  readOnly={isPending}
                  aria-invalid={tituloErrors.length > 0}
                />
                {tituloErrors.map((m, i) => (
                  <FieldError key={i}>{m}</FieldError>
                ))}
              </Field>
              <Field data-invalid={mensajeErrors.length > 0}>
                <FieldLabel htmlFor="mensaje">Mensaje</FieldLabel>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Describe la notificación con el detalle necesario"
                  defaultValue={notificacion.mensaje ?? ""}
                  readOnly={isPending}
                  aria-invalid={mensajeErrors.length > 0}
                />
                <FieldDescription>
                  Este texto será visible para todos los visitantes.
                </FieldDescription>
                {mensajeErrors.map((m, i) => (
                  <FieldError key={i}>{m}</FieldError>
                ))}
              </Field>
              <Field data-invalid={nivelErrors.length > 0}>
                <FieldLabel htmlFor="nivel-trigger">Nivel</FieldLabel>
                <Select
                  value={nivel}
                  disabled={isPending}
                  onValueChange={(value) => {
                    if (isNivelValue(value)) setNivel(value);
                  }}
                >
                  <SelectTrigger id="nivel-trigger" className="w-full">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES.map(
                      ({ value, label, description, dotClassName, Icon }) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <span
                              aria-hidden
                              className={`size-2 shrink-0 rounded-full ${dotClassName}`}
                            />
                            <Icon className="size-4 shrink-0" aria-hidden />
                            <span className="flex flex-col items-start">
                              <span className="font-medium">{label}</span>
                              <span className="text-xs text-muted-foreground">
                                {description}
                              </span>
                            </span>
                          </span>
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <input type="hidden" name="nivel" value={nivel} />
                {nivelErrors.map((m, i) => (
                  <FieldError key={i}>{m}</FieldError>
                ))}
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
                  <Badge
                    variant="outline"
                    className={selectedNivel.badgeClassName}
                  >
                    <selectedNivel.Icon className="size-3" aria-hidden />
                    {selectedNivel.label}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {selectedNivel.description}
                  </p>
                </div>
              </Field>
            </CardContent>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Publicación</CardTitle>
              <CardDescription>
                Controla la visibilidad y la vigencia.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="fechaCaducidad">
                  Fecha de caducidad
                </FieldLabel>
                <Input
                  id="fechaCaducidad"
                  name="fechaCaducidad"
                  type="datetime-local"
                  defaultValue={notificacion.fechaCaducidad?.slice(0, 16) ?? ""}
                  readOnly={isPending}
                />
                <FieldDescription>
                  Opcional. A partir de esa fecha dejará de mostrarse.
                </FieldDescription>
              </Field>
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                {!isEdit && (
                  <p className="text-xs text-muted-foreground">
                    Se creará como borrador. Podrás publicarla editándola
                    después.
                  </p>
                )}
                {isEdit && (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="publicada"
                      name="publicada"
                      defaultChecked={notificacion.publicada ?? false}
                      disabled={isPending}
                    />
                    <div className="grid gap-0.5">
                      <Label htmlFor="publicada" className="cursor-pointer">
                        Publicada
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Si está desactivada se guarda como borrador.
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="fijada"
                    name="fijada"
                    defaultChecked={notificacion.fijada ?? false}
                    disabled={isPending}
                  />
                  <div className="grid gap-0.5">
                    <Label htmlFor="fijada" className="cursor-pointer">
                      Fijada
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Aparecerá destacada al principio del listado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending
                  ? "Guardando…"
                  : isEdit
                    ? "Guardar cambios"
                    : "Crear notificación"}
              </Button>
            </CardFooter>
          </Card>

          <CategoriasCardForm
            categorias={visibleCategorias}
            selectedCategoriaIds={selectedCategoriaIds}
            onCreateCategoria={handleCreateCategoria}
            disabled={isPending}
            loadError={categoriasFailed}
            onRetry={handleRetryCategorias}
            retrying={retryingCategorias}
          />

          <TagsCardForm
            key={notificacion.id}
            tags={visibleTags}
            initialSelectedTagIds={initialTagIds}
            onCreateTag={handleCreateTag}
            disabled={isPending}
            loadError={tagsFailed}
            onRetry={handleRetryTags}
            retrying={retryingTags}
          />
        </div>
      </form>
    </div>
  );
}
