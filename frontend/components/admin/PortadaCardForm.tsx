"use client";

import { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getMediaAbsoluteUrl } from "@/lib/media-url";

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string>(defaultUrl ?? "");
  const [loadError, setLoadError] = useState(false);

  function handlePreview() {
    const value = inputRef.current?.value.trim() ?? "";
    setPreview(value);
    setLoadError(false);
  }

  function handleRemove() {
    if (inputRef.current) inputRef.current.value = "";
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

        <div className="grid gap-2">
          <Label htmlFor="imagenPortada">URL de la imagen</Label>
          <Input
            ref={inputRef}
            type="text"
            id="imagenPortada"
            name="imagenPortada"
            placeholder="Pega la URL del archivo media (/uploads/… o https://…)"
            defaultValue={defaultUrl ?? ""}
            aria-invalid={fieldErrors.length > 0}
            aria-describedby={fieldErrors.length > 0 ? "imagenPortada-error" : undefined}
            disabled={disabled}
          />
          {fieldErrors.length > 0 && (
            <div id="imagenPortada-error">
              {fieldErrors.map((m, i) => (
                <p key={i} className="text-sm text-destructive">
                  {m}
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={handlePreview} disabled={disabled}>
            Establecer imagen
          </Button>
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
