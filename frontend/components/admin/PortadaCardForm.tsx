"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { MediaTipo } from "@/types";
import MediaSelector from "./media-selector/MediaSelector";

type PortadaCardFormProps = {
  defaultUrl?: string | null;
  disabled?: boolean;
  fieldErrors?: string[];
};

export default function PortadaCardForm({
  defaultUrl = null,
  disabled = false,
  fieldErrors = [],
}: PortadaCardFormProps) {
  const [preview, setPreview] = useState<string>(defaultUrl ?? "");
  const [loadError, setLoadError] = useState(false);

  function handleRemove() {
    setPreview("");
    setLoadError(false);
  }

  const resolvedSrc = preview.trim() === "" ? "" : getMediaAbsoluteUrl(preview.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle>Imagen destacada</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {resolvedSrc !== "" && !loadError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resolvedSrc}
            alt="Previsualización de la portada"
            className="aspect-video w-full rounded-md border object-cover"
            onError={() => setLoadError(true)}
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground">
            <ImageIcon aria-hidden className="size-8" />
            <p className="text-xs">
              {loadError ? "No se pudo cargar la imagen" : "Sin imagen destacada"}
            </p>
          </div>
        )}

        <input type="hidden" name="imagenPortada" value={preview} />
        {fieldErrors.length > 0 && (
          <div id="imagenPortada-error" role="alert">
            {fieldErrors.map((m, i) => (
              <p key={i} className="text-sm text-destructive">
                {m}
              </p>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <MediaSelector
            acceptedTypes={[MediaTipo.Imagen]}
            title="Elegir imagen destacada"
            description="Elige una imagen de la biblioteca o sube una nueva."
            valueUrl={preview.trim() === "" ? null : preview}
            disabled={disabled}
            onSelect={(media) => {
              setPreview(media.url);
              setLoadError(false);
            }}
          />
          {preview.trim() !== "" && (
            <Button type="button" variant="ghost" onClick={handleRemove} disabled={disabled}>
              Eliminar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
