"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ImagePlus } from "lucide-react";
import { getMediaAbsoluteUrl } from "@/lib/media-url";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MediaTipo, type MediaDto } from "@/types";
import MediaDetailSidebar from "./MediaDetailSidebar";
import MediaLibraryTab, { ALL_TIPOS } from "./MediaLibraryTab";
import MediaUploadTab from "./MediaUploadTab";
import { MEDIA_PAGE_SIZE, useMediaLibrary } from "./useMediaLibrary";

export type MediaSelectorProps = {
  /** Selección inicial (controlada desde fuera solo como valor inicial). */
  value?: MediaDto | null;
  /**
   * URL del media actual (relativa `/uploads/…` o absoluta). Si no hay
   * `value`, se busca en la biblioteca y se preselecciona al abrir.
   */
  valueUrl?: string | null;
  onSelect: (media: MediaDto) => void;
  /** Tipos aceptados. Vacío = todos. Si hay uno solo, el filtro se bloquea. */
  acceptedTypes?: MediaTipo[];
  title?: string;
  description?: string;
  /** Trigger personalizado. Si se omite, botón «Elegir de la biblioteca». */
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpload?: (file: File, altText?: string) => Promise<MediaDto>;
  disabled?: boolean;
};

function matchMediaByUrl(items: MediaDto[], url: string): MediaDto | undefined {
  const target = url.trim();
  if (target === "") return undefined;
  return items.find(
    (m) => m.url === target || getMediaAbsoluteUrl(m.url) === target,
  );
}

export default function MediaSelector({
  value = null,
  valueUrl = null,
  onSelect,
  acceptedTypes = [],
  title = "Biblioteca de medios",
  description = "Elige un archivo de la biblioteca o sube uno nuevo.",
  trigger,
  open: controlledOpen,
  onOpenChange,
  onUpload,
  disabled = false,
}: MediaSelectorProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = (v: boolean) => {
    if (controlledOpen === undefined) setUncontrolledOpen(v);
    onOpenChange?.(v);
  };

  const allowedTypes = acceptedTypes.length > 0 ? acceptedTypes : ALL_TIPOS;
  const lockTipo = acceptedTypes.length === 1;
  const [tipoFilter, setTipoFilter] = useState<MediaTipo | undefined>(
    lockTipo ? acceptedTypes[0] : undefined,
  );
  const [tab, setTab] = useState("biblioteca");
  const [selected, setSelected] = useState<MediaDto | null>(value);

  const { items, loading, loadingMore, error, hasMore, loadMore, prepend, reload } =
    useMediaLibrary({ tipo: tipoFilter, pageSize: MEDIA_PAGE_SIZE, autoLoad: open });

  function handleOpenChange(next: boolean) {
    if (next) {
      setSelected(value);
      setTab("biblioteca");
      if (lockTipo) setTipoFilter(acceptedTypes[0]);
    }
    setOpen(next);
  }

  // Preselecciona el media actual al abrir: por `value`, o buscando
  // `valueUrl` en la biblioteca cuando esta termina de cargar.
  useEffect(() => {
    if (!open || selected) return;
    const target = value
      ? (items.find((m) => m.id === value.id) ?? value)
      : valueUrl
        ? matchMediaByUrl(items, valueUrl)
        : undefined;
    if (target) {
      // Efecto de sincronización con la biblioteca cargada.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(target);
    }
  }, [open, items, value, valueUrl, selected]);

  function handleUploaded(media: MediaDto) {
    // Solo se incorpora si encaja con el filtro actual.
    if (tipoFilter === undefined || media.tipo === tipoFilter) prepend(media);
    setSelected(media);
    setTab("biblioteca");
  }

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    setOpen(false);
  }

  // Sin trigger visible cuando el diálogo se controla desde fuera (p. ej. Tiptap).
  const showTrigger = trigger !== undefined || controlledOpen === undefined;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {showTrigger &&
        (trigger !== undefined ? (
          <DialogTrigger
            nativeButton={false}
            render={<span className="inline-flex" />}
            disabled={disabled}
          >
            {trigger}
          </DialogTrigger>
        ) : (
          <DialogTrigger
            render={
              <Button type="button" variant="outline" disabled={disabled} />
            }
          >
            <ImagePlus aria-hidden />
            Elegir de la biblioteca
          </DialogTrigger>
        ))}

      <DialogContent className="max-h-[85vh] min-h-[60vh] grid-rows-[auto_minmax(0,1fr)_auto] sm:max-w-5xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className="flex min-h-0 flex-1 flex-col"
        >
          <TabsList className="shrink-0 self-start">
            <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger>
            <TabsTrigger value="subir">Subir archivos</TabsTrigger>
          </TabsList>

          <TabsContent
            value="biblioteca"
            className="mt-3 min-h-0 flex-1 data-[state=inactive]:hidden"
          >
            <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1fr_280px]">
              <MediaLibraryTab
                items={items}
                loading={loading}
                loadingMore={loadingMore}
                error={error}
                hasMore={hasMore}
                tipoFilter={tipoFilter}
                onTipoChange={setTipoFilter}
                allowedTypes={allowedTypes}
                lockTipo={lockTipo}
                selectedId={selected?.id ?? null}
                onPick={setSelected}
                onLoadMore={loadMore}
                onRetry={reload}
              />
              <div className="hidden min-h-0 min-w-0 overflow-y-auto pr-1 lg:block">
                <MediaDetailSidebar media={selected} />
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="subir"
            className="mt-3 min-h-0 flex-1 overflow-y-auto data-[state=inactive]:hidden"
          >
            <MediaUploadTab
              allowedTypes={allowedTypes}
              onUploaded={handleUploaded}
              onUpload={onUpload}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter className="shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancelar
          </Button>
          <Button type="button" disabled={!selected} onClick={handleConfirm}>
            Seleccionar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
