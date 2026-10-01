"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, FileText } from "lucide-react";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
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

export default function MediaDetailsDialog({
  media,
  onDelete,
  onDeleted,
}: {
  media: MediaDto;
  onDelete: (id: string) => Promise<void>;
  onDeleted: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const src = getMediaAbsoluteUrl(media.url);

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

      <DeleteMediaButton
        id={media.id}
        nombre={media.nombreOriginal}
        onDelete={onDelete}
        onDeleted={onDeleted}
      />
    </DialogContent>
  );
}
