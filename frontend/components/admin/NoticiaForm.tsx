"use client";

import { useState } from "react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import type { CategoriaDto, TagDto } from "@/types";

export default function NoticiaForm({
  categorias,
  tags,
  onCreate,
}: {
  categorias: CategoriaDto[];
  tags: TagDto[];
  onCreate: (formData: FormData) => Promise<void>;
}) {
  const [contenido, setContenido] = useState("");

  return (
    <form action={onCreate}>
      <div>
        <label htmlFor="titulo">Titulo *</label>
        <input type="text" id="titulo" name="titulo" required maxLength={200} />
      </div>

      <div>
        <label htmlFor="subtitulo">Subtitulo</label>
        <input type="text" id="subtitulo" name="subtitulo" maxLength={300} />
      </div>

      <div>
        <label htmlFor="contenido">Contenido *</label>
        <Tiptap content={contenido} onChange={setContenido} />
        <input type="hidden" name="contenido" value={contenido} />
      </div>

      <div>
        <label htmlFor="publicada">Publicada</label>
        <input type="checkbox" id="publicada" name="publicada" />
      </div>

      <div>
        <label htmlFor="fijada">Fijada</label>
        <input type="checkbox" id="fijada" name="fijada" />
      </div>

      <div>
        <label htmlFor="categoriaIds">Categorias</label>
        {categorias.map((c) => (
          <input
            key={c.id}
            type="checkbox"
            name="categoriaIds"
            value={c.id}
            id={c.id}
          />
        ))}
      </div>

      <div>
        <label htmlFor="tagIds">Tags</label>
        {tags.map((t) => (
          <input
            key={t.id}
            type="checkbox"
            name="tagIds"
            value={t.id}
            id={t.id}
          />
        ))}
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
}
