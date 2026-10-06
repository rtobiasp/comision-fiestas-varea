"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  Loader2,
  Plus,
  TriangleAlert,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Field, FieldDescription, FieldGroup } from "../ui/field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type { MediaDto } from "@/types";
import { toFormError } from "@/lib/api/form-error";

type CreateMediaFormProps = {
  onSubmit: (formData: FormData) => Promise<MediaDto>;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif)$/i.test(file.name);
}

function kindLabel(file: File): string {
  if (isImageFile(file)) return "Imagen";
  if (file.type === "application/pdf" || /\.pdf$/i.test(file.name))
    return "PDF";
  if (file.type.startsWith("video/")) return "Vídeo";
  return "Archivo";
}

export default function CreateMediaForm({ onSubmit }: CreateMediaFormProps) {
  const [opened, setOpened] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  const isImage = selectedFile ? isImageFile(selectedFile) : false;

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  function setPreviewFor(file: File | null) {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
    if (file && isImageFile(file)) {
      const url = URL.createObjectURL(file);
      previewRef.current = url;
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

  function clearSelection() {
    setSelectedFile(null);
    setPreviewFor(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (error) setError(null);
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0] ?? null;
    setSelectedFile(file);
    setPreviewFor(file);
    if (error) setError(null);
  }

  const [, formAction, isPending] = useActionState(
    async (_prev: null, formData: FormData): Promise<null> => {
      setError(null);
      try {
        await onSubmit(formData);
        formRef.current?.reset();
        clearSelection();
      } catch (error) {
        setError(toFormError(error).message);
      }
      return null;
    },
    null,
  );

  if (!opened) {
    return (
      <div className="mt-3">
        <Button onClick={() => setOpened(true)}>
          <Plus />
          Añadir media
        </Button>
      </div>
    );
  }

  return (
    <Card className="mt-4 max-w-2xl">
      <CardHeader>
        <CardTitle>Subir archivo</CardTitle>
      </CardHeader>
      <form ref={formRef} action={formAction}>
        <CardContent>
          <FieldGroup>
            <Field>
              <Label htmlFor="file">Archivo</Label>
              <Label
                htmlFor="file"
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
                  "hover:border-ring hover:bg-muted/50",
                  dragOver && "border-ring bg-muted/60",
                  isPending && "pointer-events-none opacity-60",
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  if (isPending) return;
                  const file = e.dataTransfer.files?.[0] ?? null;
                  if (file && fileInputRef.current) {
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    fileInputRef.current.files = dt.files;
                  }
                  handleFiles(e.dataTransfer.files);
                }}
              >
                <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                  <CloudUpload
                    aria-hidden
                    className="size-5 text-muted-foreground"
                  />
                </span>
                <span className="text-sm">
                  <span className="font-medium text-primary underline-offset-4 hover:underline">
                    Haz clic para elegir
                  </span>{" "}
                  <span className="text-muted-foreground">
                    o arrastra el archivo aquí
                  </span>
                </span>
              </Label>
              <Input
                ref={fileInputRef}
                id="file"
                type="file"
                name="file"
                required
                disabled={isPending}
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,video/mp4,video/webm"
                className="sr-only"
                aria-invalid={error !== null}
                aria-describedby={error ? "media-error" : undefined}
                onChange={(e) => handleFiles(e.target.files)}
              />
              {selectedFile && (
                <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
                  {previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt=""
                      className="size-12 shrink-0 rounded-lg object-cover"
                    />
                  ) : (
                    <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                      {selectedFile.type.startsWith("video/") ? (
                        <Video
                          aria-hidden
                          className="size-5 text-muted-foreground"
                        />
                      ) : (
                        <FileText
                          aria-hidden
                          className="size-5 text-muted-foreground"
                        />
                      )}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {selectedFile.name}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <Badge variant="secondary">
                        {kindLabel(selectedFile)}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatBytes(selectedFile.size)}
                      </span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={isPending}
                    onClick={clearSelection}
                    aria-label="Quitar archivo seleccionado"
                  >
                    <X />
                  </Button>
                </div>
              )}
            </Field>

            {isImage ? (
              <Field>
                <Label htmlFor="altText">Texto alternativo *</Label>
                <Input
                  id="altText"
                  name="altText"
                  required
                  maxLength={300}
                  placeholder="Describe la imagen para lectores de pantalla"
                  disabled={isPending}
                  aria-invalid={error !== null}
                  aria-describedby={
                    error ? "media-alt-hint media-error" : "media-alt-hint"
                  }
                  onChange={() => {
                    if (error) setError(null);
                  }}
                />
                <FieldDescription id="media-alt-hint">
                  Obligatorio en imágenes. Se usa como atributo alt
                  (accesibilidad y SEO).
                </FieldDescription>
              </Field>
            ) : (
              selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Este tipo de archivo no necesita texto alternativo.
                </p>
              )
            )}

            {error && (
              <Alert variant="destructive" id="media-error">
                <TriangleAlert />
                <AlertTitle>No se ha podido subir el archivo</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </FieldGroup>
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => {
              formRef.current?.reset();
              clearSelection();
              setOpened(false);
            }}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending || !selectedFile}>
            {isPending && <Loader2 aria-hidden className="animate-spin" />}
            {isPending ? "Subiendo…" : "Subir"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
