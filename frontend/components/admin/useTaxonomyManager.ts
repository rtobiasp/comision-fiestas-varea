"use client";

import { useState } from "react";
import { getCategorias } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import type { CategoriaDto, TagDto } from "@/types";

export function useTaxonomyManager(
  categorias: CategoriaDto[],
  tags: TagDto[],
  categoriasError: boolean,
  tagsError: boolean,
  isPending: boolean,
) {
  const [visibleCategorias, setVisibleCategorias] =
    useState<CategoriaDto[]>(categorias);
  const [visibleTags, setVisibleTags] = useState<TagDto[]>(tags);
  const [categoriasFailed, setCategoriasFailed] = useState(categoriasError);
  const [tagsFailed, setTagsFailed] = useState(tagsError);
  const [retryingCategorias, setRetryingCategorias] = useState(false);
  const [retryingTags, setRetryingTags] = useState(false);

  async function handleRetryCategorias() {
    if (retryingCategorias || isPending) return;
    setRetryingCategorias(true);
    try {
      setVisibleCategorias(await getCategorias());
      setCategoriasFailed(false);
    } catch {
      setCategoriasFailed(true);
    } finally {
      setRetryingCategorias(false);
    }
  }

  async function handleRetryTags() {
    if (retryingTags || isPending) return;
    setRetryingTags(true);
    try {
      setVisibleTags(await getTags());
      setTagsFailed(false);
    } catch {
      setTagsFailed(true);
    } finally {
      setRetryingTags(false);
    }
  }

  function appendCategoria(created: CategoriaDto) {
    setVisibleCategorias((prev) =>
      prev.some((c) => c.id === created.id) ? prev : [...prev, created],
    );
  }

  function appendTag(created: TagDto) {
    setVisibleTags((prev) =>
      prev.some((t) => t.id === created.id) ? prev : [...prev, created],
    );
  }

  return {
    visibleCategorias,
    visibleTags,
    categoriasFailed,
    tagsFailed,
    retryingCategorias,
    retryingTags,
    handleRetryCategorias,
    handleRetryTags,
    appendCategoria,
    appendTag,
  };
}
