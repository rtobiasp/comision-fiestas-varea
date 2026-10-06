"use client";

import { useCallback, useEffect, useState } from "react";
import { getAllMedias } from "@/lib/api/media";
import type { MediaDto } from "@/types";
import type { MediaTipo } from "@/types";

export const MEDIA_PAGE_SIZE = 24;

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

  useEffect(() => {
    if (!autoLoad) return;
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setError(null);
    getAllMedias(tipo, 0, pageSize)
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setHasMore(data.length === pageSize);
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setItems([]);
        setHasMore(false);
        setError(e instanceof Error ? e.message : "No se pudo cargar la media");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tipo, pageSize, reloadKey, autoLoad]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const data = await getAllMedias(tipo, items.length, pageSize);
      setItems((prev) => {
        const known = new Set(prev.map((m) => m.id));
        return [...prev, ...data.filter((m) => !known.has(m.id))];
      });
      setHasMore(data.length === pageSize);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo cargar más media");
    } finally {
      setLoadingMore(false);
    }
  }, [tipo, items.length, pageSize, loading, loadingMore, hasMore]);

  const prepend = useCallback((media: MediaDto) => {
    setItems((prev) =>
      prev.some((m) => m.id === media.id) ? prev : [media, ...prev],
    );
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
