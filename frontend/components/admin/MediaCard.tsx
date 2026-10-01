"use client";

import Image from "next/image";
import { FileText, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MediaDetailsDialog from "./MediaDetailsDialog";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { MediaDto, MediaTipo } from "@/types";

type MediaCardProps = {
  media: MediaDto;
};

export default function MediaCard({ media }: MediaCardProps) {
  const src = getMediaAbsoluteUrl(media.url);

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Card className="relative aspect-square w-full cursor-pointer gap-0 overflow-hidden p-0 py-0 text-left transition-shadow hover:shadow-md hover:ring-2 hover:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
        }
      >
        {media.tipo === MediaTipo.Imagen ? (
          <Image
            src={src}
            alt={media.altText ?? media.nombreOriginal}
            fill
            sizes="(max-width: 768px) 25vw, 12vw"
            className="object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-muted">
            {media.tipo === MediaTipo.Video ? (
              <Video aria-hidden className="size-10 text-muted-foreground" />
            ) : (
              <FileText aria-hidden className="size-10 text-muted-foreground" />
            )}
          </span>
        )}

        <span className="absolute inset-x-0 bottom-0 block bg-muted px-3 py-2">
          <span className="block truncate text-xs text-muted-foreground">
            {media.nombreOriginal}
          </span>
        </span>
      </DialogTrigger>
      <MediaDetailsDialog media={media} />
    </Dialog>
  );
}
