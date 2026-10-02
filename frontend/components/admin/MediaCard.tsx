"use client";

import { useState } from "react";
import Image from "next/image";
import { FileText, Video } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import MediaDetailsDialog from "./MediaDetailsDialog";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { MediaDto, MediaTipo } from "@/types";

type MediaCardProps = {
  media: MediaDto;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (formData: FormData) => Promise<void>;
  priority?: boolean;
};

export default function MediaCard({
  media,
  onDelete,
  onUpdate,
  priority = false,
}: MediaCardProps) {
  const [open, setOpen] = useState(false);
  const src = getMediaAbsoluteUrl(media.url);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        nativeButton={false}
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
            priority={priority}
            loading={priority ? "eager" : undefined}
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
      <MediaDetailsDialog
        media={media}
        onDelete={onDelete}
        onDeleted={() => setOpen(false)}
        onUpdate={onUpdate}
      />
    </Dialog>
  );
}
