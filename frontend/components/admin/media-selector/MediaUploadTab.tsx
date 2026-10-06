"use client";

import { useEffect, useRef, useState } from "react";
import {
  CloudUpload,
  FileText,
  Loader2,
  TriangleAlert,
  Video,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormError } from "@/lib/api/form-error";
import { uploadMedia } from "@/lib/api/media";
import { MediaTipo, type MediaDto } from "@/types";

function acceptFor(types: MediaTipo[]): string {
  const parts: string[] = [];
  if (types.includes(MediaTipo.Imagen))
    parts.push("image/jpeg,image/png,image/webp,image/gif");
  if (types.includes(MediaTipo.Pdf)) parts.push("application/pdf");
  if (types.includes(MediaTipo.Video)) parts.push("video/mp4,video/webm");
  return parts.join(",");
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

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type MediaUploadTabProps = {
  allowedTypes: MediaTipo[];
  onUploaded: (media: MediaDto) => void;
  onUpload?: (file: File, altText?: string) => Promise<MediaDto>;
};

export default function MediaUploadTab({
  allowedTypes,
  onUploaded,
  onUpload,
}: MediaUploadTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altText, setAltText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    };
  }, []);

  const isImage = selectedFile ? isImageFile(selectedFile) : false;

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
    setAltText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setError(null);
  }

  function handleFiles(files: FileList | null) {
    const file = files?.[0] ?? null;
    setSelectedFile(file);
    setPreviewFor(file);
    setError(null);
  }

  async function handleUpload() {
    if (!selectedFile || pending) return;
    if (isImage && altText.trim() === "") {
      setError("El texto alternativo es obligatorio en imágenes.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      const alt = altText.trim() === "" ? undefined : altText.trim();
      const created = onUpload
        ? await onUpload(selectedFile, alt)
        : await uploadMedia({ file: selectedFile, altText: alt });
      clearSelection();
      onUploaded(created);
    } catch (e) {
      setError(toFormError(e).message);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <Label htmlFor="media-selector-file">Archivo</Label>
        <Label
          htmlFor="media-selector-file"
          className={cn(
            "mt-1.5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors",
            "hover:border-ring hover:bg-muted/50",
            dragOver && "border-ring bg-muted/60",
            pending && "pointer-events-none opacity-60",
          )}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (pending) return;
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
            <CloudUpload aria-hidden className="size-5 text-muted-foreground" />
          </span>
          <span className="text-sm">
            <span className="font-medium text-primary underline-offset-4 hover:underline">
              Haz clic para elegir
            </span>{" "}
            <span className="text-muted-foreground">
              o arrastra el archivo aquí
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP, GIF · PDF · MP4, WebM
          </span>
        </Label>
        <Input
          ref={fileInputRef}
          id="media-selector-file"
          type="file"
          required
          disabled={pending}
          accept={acceptFor(allowedTypes)}
          className="sr-only"
          aria-invalid={error !== null}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

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
                <Video aria-hidden className="size-5 text-muted-foreground" />
              ) : (
                <FileText aria-hidden className="size-5 text-muted-foreground" />
              )}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{selectedFile.name}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{kindLabel(selectedFile)}</Badge>
              <span className="text-xs text-muted-foreground">
                {formatBytes(selectedFile.size)}
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={pending}
            onClick={clearSelection}
            aria-label="Quitar archivo seleccionado"
          >
            <X />
          </Button>
        </div>
      )}

      {isImage && (
        <Field>
          <Label htmlFor="media-selector-alt">Texto alternativo *</Label>
          <Input
            id="media-selector-alt"
            value={altText}
            maxLength={300}
            placeholder="Describe la imagen para lectores de pantalla"
            disabled={pending}
            onChange={(e) => {
              setAltText(e.target.value);
              if (error) setError(null);
            }}
          />
          <FieldDescription>
            Obligatorio en imágenes. Se usa como atributo alt (accesibilidad y
            SEO).
          </FieldDescription>
        </Field>
      )}

      {error && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se ha podido subir el archivo</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          disabled={pending || !selectedFile}
          onClick={handleUpload}
        >
          {pending && <Loader2 aria-hidden className="animate-spin" />}
          {pending ? "Subiendo…" : "Subir y seleccionar"}
        </Button>
      </div>
    </div>
  );
}
