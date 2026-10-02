"use client";

import { useActionState, useState } from "react";
import Image from "next/image";
import { Check, Copy, FileText, Loader2, TriangleAlert } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { toFormError, type FormErrorState } from "@/lib/api/form-error";
import { MediaDto, MediaTipo } from "@/types";
import DeleteMediaButton from "./DeleteMediaButton";

const tipoLabel: Record<number, string> = {
  [MediaTipo.Imagen]: "Imagen",
  [MediaTipo.Pdf]: "PDF",
  [MediaTipo.Video]: "Vídeo",
};

function hasDimensions(
  media: MediaDto,
): media is MediaDto & { ancho: number | string; alto: number | string } {
  return media.ancho != null && media.alto != null;
}

function splitExtension(nombre: string): { stem: string; ext: string } {
  const i = nombre.lastIndexOf(".");
  return i > 0 ? { stem: nombre.slice(0, i), ext: nombre.slice(i) } : { stem: nombre, ext: "" };
}

export default function MediaDetailsDialog({
  media,
  onDelete,
  onDeleted,
  onUpdate,
}: {
  media: MediaDto;
  onDelete: (id: string) => Promise<void>;
  onDeleted: () => void;
  onUpdate: (formData: FormData) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const src = getMediaAbsoluteUrl(media.url);
  const isImage = media.tipo === MediaTipo.Imagen;
  const { stem: initialStem, ext } = splitExtension(media.nombreOriginal);

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      try {
        await onUpdate(formData);
        return { ok: true };
      } catch (e) {
        return { ok: false, ...toFormError(e) };
      }
    },
    null,
  );

  const fieldErrors =
    submitState !== null && !submitState.ok ? submitState.fieldErrors : {};
  const tituloErrors = fieldErrors.nombreoriginal ?? [];
  const altErrors = fieldErrors.alttext ?? [];

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(src);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <DialogContent className="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle className="break-all">{media.nombreOriginal}</DialogTitle>
        <DialogDescription>
          {tipoLabel[media.tipo]} · {formatBytes(media.tamanoBytes)}
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 sm:grid-cols-[1.2fr_1fr]">
        <div>
          {media.tipo === MediaTipo.Imagen ? (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
              <Image
                src={src}
                alt={media.altText ?? media.nombreOriginal}
                fill
                sizes="(max-width: 640px) 90vw, 40vw"
                className="object-contain"
              />
            </div>
          ) : media.tipo === MediaTipo.Video ? (
            <video
              src={src}
              controls
              preload="metadata"
              className="aspect-video w-full rounded-lg bg-black"
            />
          ) : (
            <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg bg-muted">
              <FileText
                aria-hidden
                className="size-16 text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Vista previa no disponible de momento
              </p>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Tipo</dt>
            <dd className="min-w-0 break-all">{tipoLabel[media.tipo]}</dd>

            <dt className="text-muted-foreground">Contenido</dt>
            <dd className="min-w-0 break-all">{media.contentType}</dd>

            <dt className="text-muted-foreground">Tamaño</dt>
            <dd>{formatBytes(media.tamanoBytes)}</dd>

            {hasDimensions(media) && (
              <>
                <dt className="text-muted-foreground">Dimensiones</dt>
                <dd>
                  {media.ancho} × {media.alto}
                </dd>
              </>
            )}

            {media.duracionSeg != null && (
              <>
                <dt className="text-muted-foreground">Duración</dt>
                <dd>{formatDuration(media.duracionSeg)}</dd>
              </>
            )}

            {media.altText && (
              <>
                <dt className="text-muted-foreground">Alt</dt>
                <dd className="min-w-0 break-all">{media.altText}</dd>
              </>
            )}

            <dt className="text-muted-foreground">Subido el</dt>
            <dd>{formatDateTime(media.createdAt)}</dd>
          </dl>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`media-url-${media.id}`}>URL del archivo</Label>
            <div className="flex gap-2">
              <Input
                id={`media-url-${media.id}`}
                value={src}
                readOnly
                onFocus={(e) => e.target.select()}
                className="min-w-0"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label={copied ? "URL copiada" : "Copiar URL"}
              >
                {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
              </Button>
            </div>
            {copied && (
              <p className="text-xs text-muted-foreground">
                URL copiada al portapapeles
              </p>
            )}
          </div>
        </div>
      </div>

      <form action={formAction} aria-busy={isPending} className="border-t pt-4">
        <h3 className="text-sm font-medium">Título y texto alternativo</h3>
        <FieldGroup className="mt-3">
          <input type="hidden" name="id" value={media.id} />
          <input type="hidden" name="extension" value={ext} />
          <Field>
            <Label htmlFor={`media-titulo-${media.id}`}>Título *</Label>
            <div className="flex items-stretch">
              <Input
                id={`media-titulo-${media.id}`}
                key={`media-titulo-${media.id}-${media.nombreOriginal}`}
                name="nombreOriginal"
                required
                maxLength={Math.max(1, 255 - ext.length)}
                defaultValue={initialStem}
                disabled={isPending}
                aria-invalid={tituloErrors.length > 0}
                aria-describedby={
                  tituloErrors.length > 0
                    ? `media-titulo-hint-${media.id} media-titulo-error-${media.id}`
                    : `media-titulo-hint-${media.id}`
                }
                className={ext ? "rounded-r-none" : undefined}
              />
              {ext && (
                <span
                  aria-hidden
                  className="flex h-8 shrink-0 items-center rounded-r-lg border border-l-0 border-input bg-muted px-2.5 text-sm text-muted-foreground"
                >
                  {ext}
                </span>
              )}
            </div>
            <FieldDescription id={`media-titulo-hint-${media.id}`}>
              Solo cambia la referencia en la base de datos; el archivo no se
              renombra y la extensión no se puede cambiar.
            </FieldDescription>
            {tituloErrors.length > 0 && (
              <div id={`media-titulo-error-${media.id}`} role="alert">
                {tituloErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </Field>
          <Field>
            <Label htmlFor={`media-alt-${media.id}`}>
              Texto alternativo{isImage ? " *" : ""}
            </Label>
            <Input
              id={`media-alt-${media.id}`}
              key={`media-alt-${media.id}-${media.altText ?? ""}`}
              name="altText"
              required={isImage}
              maxLength={300}
              placeholder={
                isImage
                  ? "Describe la imagen para lectores de pantalla"
                  : "Texto alternativo (opcional)"
              }
              defaultValue={media.altText ?? ""}
              disabled={isPending}
              aria-invalid={altErrors.length > 0}
              aria-describedby={
                altErrors.length > 0
                  ? `media-alt-hint-${media.id} media-alt-error-${media.id}`
                  : `media-alt-hint-${media.id}`
              }
            />
            <FieldDescription id={`media-alt-hint-${media.id}`}>
              {isImage
                ? "Obligatorio en imágenes. Se usa como atributo alt (accesibilidad y SEO)."
                : "Opcional en este tipo de archivo."}
            </FieldDescription>
            {altErrors.length > 0 && (
              <div id={`media-alt-error-${media.id}`} role="alert">
                {altErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </Field>
          {submitState !== null && !submitState.ok && (
            <Alert variant="destructive">
              <TriangleAlert />
              <AlertTitle>No se han podido guardar los cambios</AlertTitle>
              <AlertDescription>{submitState.message}</AlertDescription>
            </Alert>
          )}
          {submitState !== null && submitState.ok && (
            <p role="status" className="text-sm text-muted-foreground">
              Cambios guardados.
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 aria-hidden className="animate-spin" />}
              {isPending ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </FieldGroup>
      </form>

      <DeleteMediaButton
        id={media.id}
        nombre={media.nombreOriginal}
        onDelete={onDelete}
        onDeleted={onDeleted}
      />
    </DialogContent>
  );
}
