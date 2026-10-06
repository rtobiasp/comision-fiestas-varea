"use client";

import Image from "next/image";
import { Check, Copy, FileText, Video } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBytes, formatDateTime, formatDuration } from "@/lib/format";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { MediaTipo, type MediaDto } from "@/types";

const tipoLabel: Record<number, string> = {
  [MediaTipo.Imagen]: "Imagen",
  [MediaTipo.Pdf]: "PDF",
  [MediaTipo.Video]: "Vídeo",
};

export function MediaTypeBadge({ tipo }: { tipo: MediaTipo }) {
  return <Badge variant="secondary">{tipoLabel[tipo] ?? "Archivo"}</Badge>;
}

export function MediaThumb({
  media,
  priority = false,
}: {
  media: MediaDto;
  priority?: boolean;
}) {
  const src = getMediaAbsoluteUrl(media.url);
  if (media.tipo === MediaTipo.Imagen) {
    return (
      <Image
        src={src}
        alt={media.altText ?? media.nombreOriginal}
        fill
        sizes="(max-width: 768px) 30vw, 15vw"
        className="object-cover"
        priority={priority}
        loading={priority ? "eager" : undefined}
      />
    );
  }
  return (
    <span className="flex h-full w-full items-center justify-center bg-muted">
      {media.tipo === MediaTipo.Video ? (
        <Video aria-hidden className="size-10 text-muted-foreground" />
      ) : (
        <FileText aria-hidden className="size-10 text-muted-foreground" />
      )}
    </span>
  );
}

export default function MediaDetailSidebar({ media }: { media: MediaDto | null }) {
  const [copied, setCopied] = useState(false);

  if (!media) {
    return (
      <div className="flex h-full min-h-48 flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-4 text-center text-muted-foreground">
        <p className="text-sm font-medium">Sin selección</p>
        <p className="text-xs">Haz clic en un archivo para ver el detalle.</p>
      </div>
    );
  }

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
    <div className="flex min-h-0 flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
        {media.tipo === MediaTipo.Imagen ? (
          <Image
            src={src}
            alt={media.altText ?? media.nombreOriginal}
            fill
            sizes="(max-width: 1024px) 40vw, 280px"
            className="object-contain"
          />
        ) : media.tipo === MediaTipo.Video ? (
          <video
            src={src}
            controls
            preload="metadata"
            className="h-full w-full bg-black"
          />
        ) : (
          <span className="flex h-full w-full flex-col items-center justify-center gap-1">
            <FileText aria-hidden className="size-10 text-muted-foreground" />
            <span className="px-2 text-center text-xs text-muted-foreground">
              Vista previa no disponible
            </span>
          </span>
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-medium" title={media.nombreOriginal}>
          {media.nombreOriginal}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <MediaTypeBadge tipo={media.tipo} />
          <span className="text-xs text-muted-foreground">
            {formatBytes(media.tamanoBytes)}
          </span>
        </div>
      </div>

      <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-xs">
        <dt className="text-muted-foreground">Tipo</dt>
        <dd className="min-w-0 break-all">{media.contentType}</dd>
        {media.ancho != null && media.alto != null && (
          <>
            <dt className="text-muted-foreground">Medidas</dt>
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
            <dd className="min-w-0 break-words">{media.altText}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Subido</dt>
        <dd>{formatDateTime(media.createdAt)}</dd>
      </dl>

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="min-w-0 flex-1"
          onClick={handleCopy}
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          <span className="truncate">
            {copied ? "Copiada" : "Copiar URL"}
          </span>
        </Button>
      </div>
    </div>
  );
}
