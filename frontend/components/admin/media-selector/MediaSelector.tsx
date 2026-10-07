"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ImagePlus } from "lucide-react";
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
import { ALL_TIPOS, MEDIA_PAGE_SIZE, matchMediaByUrl } from "@/lib/media-labels";
import MediaDetailSidebar from "./MediaDetailSidebar";
import MediaLibraryTab from "./MediaLibraryTab";
import MediaUploadTab from "./MediaUploadTab";
import { useMediaLibrary } from "./useMediaLibrary";

export type MediaSelectorProps = {
  value?: MediaDto | null;
  valueUrl?: string | null;
  onSelect: (media: MediaDto) => void;
  acceptedTypes?: MediaTipo[];
  title?: string;
  description?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpload?: (file: File, altText?: string) => Promise<MediaDto>;
  disabled?: boolean;
};

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
  const [customTipo, setCustomTipo] = useState<MediaTipo | undefined>(undefined);
  const tipoFilter = lockTipo ? acceptedTypes[0] : customTipo;
  const [tab, setTab] = useState("biblioteca");
  const [selected, setSelected] = useState<MediaDto | null>(value);

  const { items, loading, loadingMore, error, hasMore, loadMore, prepend, reload } =
    useMediaLibrary({ tipo: tipoFilter, pageSize: MEDIA_PAGE_SIZE, autoLoad: open });

  function handleOpenChange(next: boolean) {
    if (next) {
      setSelected(value);
      setTab("biblioteca");
      if (!lockTipo) setCustomTipo(undefined);
    }
    setOpen(next);
  }

  useEffect(() => {
    if (!open) return;
    if (value) {
      const target = items.find((m) => m.id === value.id) ?? value;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelected(target);
      return;
    }
    if (valueUrl && !selected) {
      const id = matchMediaByUrl(items, valueUrl);
      const target = items.find((m) => m.id === id);
      if (target) setSelected(target);
    }
  }, [open, items, value, valueUrl, selected]);

  function handleUploaded(media: MediaDto) {
    if (tipoFilter === undefined || media.tipo === tipoFilter) prepend(media);
    setSelected(media);
    setTab("biblioteca");
  }

  function handleConfirm() {
    if (!selected) return;
    onSelect(selected);
    setOpen(false);
  }

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
                onTipoChange={setCustomTipo}
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
