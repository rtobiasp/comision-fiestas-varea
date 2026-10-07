"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { MediaTipo, type MediaDto } from "@/types";
import { tipoLabelPlural } from "@/lib/media-labels";
import { MediaThumb } from "./MediaDetailSidebar";

export const ALL_TIPOS = [MediaTipo.Imagen, MediaTipo.Pdf, MediaTipo.Video];

type MediaLibraryTabProps = {
  items: MediaDto[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  tipoFilter: MediaTipo | undefined;
  onTipoChange: (t: MediaTipo | undefined) => void;
  allowedTypes: MediaTipo[];
  lockTipo: boolean;
  selectedId: string | null;
  onPick: (media: MediaDto) => void;
  onLoadMore: () => void;
  onRetry: () => void;
};

export default function MediaLibraryTab({
  items,
  loading,
  loadingMore,
  error,
  hasMore,
  tipoFilter,
  onTipoChange,
  allowedTypes,
  lockTipo,
  selectedId,
  onPick,
  onLoadMore,
  onRetry,
}: MediaLibraryTabProps) {
  const tipoValue = tipoFilter === undefined ? "todos" : String(tipoFilter);

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
      <div className="flex shrink-0 flex-wrap items-center gap-2">
        {!lockTipo && (
          <Select
            value={tipoValue}
            onValueChange={(v) =>
              onTipoChange(v === "todos" ? undefined : (Number(v) as MediaTipo))
            }
          >
            <SelectTrigger className="w-40" aria-label="Filtrar por tipo">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              {allowedTypes.map((t) => (
                <SelectItem key={t} value={String(t)}>
                  {tipoLabelPlural(t)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {loading ? "Cargando…" : `${items.length} archivos`}
        </p>
      </div>

      {error && items.length === 0 ? (
        <Alert variant="destructive">
          <AlertTitle>No se pudo cargar la biblioteca</AlertTitle>
          <AlertDescription className="flex flex-wrap items-center gap-2">
            <span>{error}</span>
            <Button type="button" variant="outline" size="sm" onClick={onRetry}>
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      ) : loading ? (
        <div
          className="grid flex-1 grid-cols-3 gap-2 overflow-hidden sm:grid-cols-4 lg:grid-cols-5"
          aria-label="Cargando archivos"
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-dashed p-6 text-center text-muted-foreground">
          <p className="text-sm font-medium">Biblioteca vacía</p>
          <p className="text-xs">
            Sube tu primer archivo desde la pestaña «Subir archivos».
          </p>
        </div>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-1">
          <div
            role="listbox"
            aria-label="Biblioteca de medios"
            aria-activedescendant={selectedId ?? undefined}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
          >
            {items.map((m) => {
              const selected = m.id === selectedId;
              return (
                <button
                  key={m.id}
                  id={`media-option-${m.id}`}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  title={m.nombreOriginal}
                  onClick={() => onPick(m)}
                  className={cn(
                    "relative aspect-square w-full overflow-hidden rounded-lg border text-left transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-transparent shadow-md ring-2 ring-ring"
                      : "hover:shadow-md hover:ring-2 hover:ring-ring/50",
                  )}
                >
                  <MediaThumb media={m} />
                  {selected && (
                    <span
                      aria-hidden
                      className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    >
                      <Check className="size-4" />
                    </span>
                  )}
                  <span className="absolute inset-x-0 bottom-0 block bg-muted px-2 py-1">
                    <span className="block truncate text-[11px] text-muted-foreground">
                      {m.nombreOriginal}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {(hasMore || loadingMore) && (
            <div className="mt-3 flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loadingMore || !hasMore}
                onClick={onLoadMore}
              >
                {loadingMore ? "Cargando…" : "Cargar más"}
              </Button>
            </div>
          )}
          {error && (
            <p role="alert" className="mt-2 text-center text-xs text-destructive">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
