"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getAllMedias } from "@/lib/api/media";
import type { MediaDto, MediaTipo } from "@/types";
import { MEDIA_PAGE_SIZE } from "@/lib/media-labels";

export { MEDIA_PAGE_SIZE };

type UseMediaLibraryOptions = {
  tipo?: MediaTipo;
  pageSize?: number;
  autoLoad?: boolean;
};

export function useMediaLibrary({
  tipo,
  pageSize = MEDIA_PAGE_SIZE,
  autoLoad = true,
}: UseMediaLibraryOptions = {}) {
  const [items, setItems] = useState<MediaDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    if (!autoLoad) return;
    const controller = new AbortController();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    offsetRef.current = 0;
    getAllMedias(tipo, 0, pageSize)
      .then((data) => {
        if (controller.signal.aborted) return;
        setItems(data);
        offsetRef.current = data.length;
        setHasMore(data.length === pageSize);
      })
      .catch((e: unknown) => {
        if (controller.signal.aborted) return;
        setItems([]);
        offsetRef.current = 0;
        setHasMore(false);
        setError(e instanceof Error ? e.message : "No se pudo cargar la media");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => {
      controller.abort();
    };
  }, [tipo, pageSize, reloadKey, autoLoad]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const data = await getAllMedias(tipo, offsetRef.current, pageSize);
      setItems((prev) => {
        const known = new Set(prev.map((m) => m.id));
        return [...prev, ...data.filter((m) => !known.has(m.id))];
      });
      offsetRef.current += data.length;
      setHasMore(data.length === pageSize);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo cargar más media");
    } finally {
      setLoadingMore(false);
    }
  }, [tipo, pageSize, loading, loadingMore, hasMore]);

  const prepend = useCallback((media: MediaDto) => {
    setItems((prev) =>
      prev.some((m) => m.id === media.id) ? prev : [media, ...prev],
    );
    offsetRef.current += 1;
  }, []);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  return {
    items,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    prepend,
    reload,
  };
}
