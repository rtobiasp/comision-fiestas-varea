import { notFound, redirect } from "next/navigation";
import NoticiaForm from "@/components/admin/NoticiaForm";
import { getCategorias } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import { getNoticiaById, updateNoticia } from "@/lib/api/noticias";

export default async function EditarNoticia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [noticia, categorias, tags] = await Promise.all([
    getNoticiaById(id).catch(() => null),
    getCategorias(),
    getTags(),
  ]);

  if (!noticia) {
    notFound();
  }

  async function updateNoticiaAction(formData: FormData): Promise<void> {
    "use server";
    await updateNoticia(id, {
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

  return (
    <NoticiaForm
      categorias={categorias}
      tags={tags}
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
    />
  );
}
