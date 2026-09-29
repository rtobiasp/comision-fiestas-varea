import { notFound, redirect } from "next/navigation";
import NoticiaForm from "@/components/admin/NoticiaForm";
import { getCategorias, createCategoria } from "@/lib/api/categorias";
import { getTags, createTag } from "@/lib/api/tags";
import { getNoticiaById, updateNoticia } from "@/lib/api/noticias";
import type { CategoriaDto, TagDto } from "@/types";

async function createCategoriaAction(
  formData: FormData,
): Promise<CategoriaDto> {
  "use server";
  return createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
  });
}

async function createTagAction(formData: FormData): Promise<TagDto> {
  "use server";
  return createTag({ nombre: String(formData.get("nombre") ?? "") });
}

export default async function EditarNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [noticiaRes, categoriasRes, tagsRes] = await Promise.allSettled([
    getNoticiaById(id),
    getCategorias(),
    getTags(),
  ]);

  if (noticiaRes.status !== "fulfilled" || noticiaRes.value == null) {
    notFound();
  }
  const noticia = noticiaRes.value;
  const categorias =
    categoriasRes.status === "fulfilled" ? categoriasRes.value : [];
  const tags = tagsRes.status === "fulfilled" ? tagsRes.value : [];
  const categoriasError = categoriasRes.status !== "fulfilled";
  const tagsError = tagsRes.status !== "fulfilled";

  async function updateNoticiaAction(formData: FormData): Promise<void> {
    "use server";
    await updateNoticia(id, {
      titulo: String(formData.get("titulo") ?? "").trim(),
      subtitulo: String(formData.get("subtitulo") ?? "").trim() || null,
      contenido: String(formData.get("contenido") ?? ""),
      publicada: formData.get("accion") === "guardar",
      fijada: formData.get("fijada") === "on",
      categoriaIds: formData.getAll("categoriaIds").map(String),
      tagIds: formData.getAll("tagIds").map(String),
    });
    redirect("/admin/noticias");
  }

  return (
    <NoticiaForm
      categorias={categorias}
      tags={tags}
      categoriasError={categoriasError}
      tagsError={tagsError}
      mode="edit"
      initial={{
        titulo: noticia.titulo,
        subtitulo: noticia.subtitulo,
        contenido: noticia.contenido,
        fijada: noticia.fijada,
        categoriaIds: noticia.categorias.map((c) => c.id),
        tagIds: noticia.tags.map((t) => t.id),
      }}
      onSubmit={updateNoticiaAction}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
