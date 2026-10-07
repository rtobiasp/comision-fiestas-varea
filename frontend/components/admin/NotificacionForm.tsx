"use client";

import { useState } from "react";
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
  FieldLabel,
} from "@/components/ui/field";
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
import { NotificacionDto, CategoriaDto, TagDto } from "@/types";
import { getCategorias } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import CategoriasCardForm from "./CategoriasCardForm";
import TagsCardForm from "./TagsCardForm";

type NotificacionFormProps = {
  isNew: boolean;
  notificacion: NotificacionDto;
  categorias: CategoriaDto[];
  tags: TagDto[];
  categoriasError?: boolean;
  tagsError?: boolean;
  onCreate: (formData: FormData) => Promise<NotificacionDto>;
  onUpdate: (formData: FormData) => Promise<void>;
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

export default function NotificacionForm({
  isNew,
  notificacion,
  categorias,
  tags,
  categoriasError = false,
  tagsError = false,
  onCreate,
  onUpdate,
  onCreateCategoria,
  onCreateTag,
}: NotificacionFormProps) {
  const [nivel, setNivel] = useState<NivelValue>(
    isNivelValue(notificacion.nivel ?? "") ? notificacion.nivel as NivelValue : "Info",
  );
  const [visibleCategorias, setVisibleCategorias] =
    useState<CategoriaDto[]>(categorias);
  const [visibleTags, setVisibleTags] = useState<TagDto[]>(tags);
  const [categoriasFailed, setCategoriasFailed] = useState(categoriasError);
  const [tagsFailed, setTagsFailed] = useState(tagsError);
  const [retryingCategorias, setRetryingCategorias] = useState(false);
  const [retryingTags, setRetryingTags] = useState(false);
  const selectedCategoriaIds = new Set(
    (notificacion.categorias ?? []).map((c) => c.id),
  );
  const initialTagIds = (notificacion.tags ?? []).map((t) => t.id);

  async function handleRetryCategorias() {
    if (retryingCategorias) return;
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
    if (retryingTags) return;
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

  const selectedNivel = NIVELES.find((item) => item.value === nivel) ?? NIVELES[0];

  async function handleAction(formData: FormData): Promise<void> {
    if (isNew) {
      await onCreate(formData);
    } else {
      await onUpdate(formData);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">
        {isNew ? "Nueva notificación" : "Editar notificación"}
      </h1>
      <form
        action={handleAction}
        key={notificacion.id}
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
              <Field>
                <FieldLabel htmlFor="titulo">Título</FieldLabel>
                <Input
                  id="titulo"
                  name="titulo"
                  type="text"
                  required
                  maxLength={200}
                  placeholder="Ej. Corte de calle por las fiestas"
                  defaultValue={notificacion.titulo ?? ""}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="mensaje">Mensaje</FieldLabel>
                <Textarea
                  id="mensaje"
                  name="mensaje"
                  required
                  rows={4}
                  placeholder="Describe la notificación con el detalle necesario"
                  defaultValue={notificacion.mensaje ?? ""}
                />
                <FieldDescription>
                  Este texto será visible para todos los visitantes.
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="nivel-trigger">Nivel</FieldLabel>
                <Select value={nivel} onValueChange={(value) => {
                  if (isNivelValue(value)) setNivel(value);
                }}>
                  <SelectTrigger id="nivel-trigger" className="w-full">
                    <SelectValue placeholder="Selecciona un nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVELES.map(({ value, label, description, dotClassName, Icon }) => (
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
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="nivel" value={nivel} />
                <div className="flex flex-wrap items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5">
                  <Badge variant="outline" className={selectedNivel.badgeClassName}>
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
                />
                <FieldDescription>
                  Opcional. A partir de esa fecha dejará de mostrarse.
                </FieldDescription>
              </Field>
              <div className="flex flex-col gap-3 rounded-lg border p-3">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="publicada"
                    name="publicada"
                    defaultChecked={notificacion.publicada ?? false}
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
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="fijada"
                    name="fijada"
                    defaultChecked={notificacion.fijada ?? false}
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
              <Button type="submit" className="w-full">
                {isNew ? "Crear notificación" : "Guardar cambios"}
              </Button>
            </CardFooter>
          </Card>

          <CategoriasCardForm
            categorias={visibleCategorias}
            selectedCategoriaIds={selectedCategoriaIds}
            onCreateCategoria={handleCreateCategoria}
            loadError={categoriasFailed}
            onRetry={handleRetryCategorias}
            retrying={retryingCategorias}
          />

          <TagsCardForm
            key={notificacion.id}
            tags={visibleTags}
            initialSelectedTagIds={initialTagIds}
            onCreateTag={handleCreateTag}
            loadError={tagsFailed}
            onRetry={handleRetryTags}
            retrying={retryingTags}
          />
        </div>
      </form>
    </div>
  );
}
