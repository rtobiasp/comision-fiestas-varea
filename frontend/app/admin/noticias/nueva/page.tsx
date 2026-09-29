import { redirect } from "next/navigation";
import NoticiaForm from "@/components/admin/NoticiaForm";
import { getCategorias, createCategoria } from "@/lib/api/categorias";
import { getTags, createTag } from "@/lib/api/tags";
import { createNoticia } from "@/lib/api/noticias";
import type { CategoriaDto, TagDto } from "@/types";

async function createNoticiaAction(formData: FormData): Promise<void> {
  "use server";
  await createNoticia({
    titulo: String(formData.get("titulo") ?? ""),
    subtitulo: String(formData.get("subtitulo") ?? "") || null,
    contenido: String(formData.get("contenido") ?? ""),
    publicada: formData.get("accion") === "guardar",
    fijada: formData.get("fijada") === "on",
    categoriaIds: formData.getAll("categoriaIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
  });
  redirect("/admin/noticias");
}

async function createCategoriaAction(
  formData: FormData,
): Promise<CategoriaDto> {
  "use server";
  const categoria = await createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
  });
  return categoria;
}

async function createTagAction(formData: FormData): Promise<TagDto> {
  "use server";
  return createTag({ nombre: String(formData.get("nombre") ?? "") });
}

export default async function Noticias() {
  const categorias = await getCategorias();
  const tags = await getTags();
  return (
    <NoticiaForm
      categorias={categorias}
      tags={tags}
      mode="create"
      onSubmit={createNoticiaAction}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
