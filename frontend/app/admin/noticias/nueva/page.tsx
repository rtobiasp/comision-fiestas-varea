import { redirect } from "next/navigation";
import NoticiaForm from "@/components/admin/NoticiaForm";
import { getCategorias } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import { createNoticia } from "@/lib/api/noticias";

async function createNoticiaAction(formData: FormData): Promise<void> {
  "use server";
  await createNoticia({
    titulo: String(formData.get("titulo") ?? ""),
    subtitulo: String(formData.get("subtitulo") ?? "") || null,
    contenido: String(formData.get("contenido") ?? ""),
    publicada: formData.get("publicada") === "on",
    fijada: formData.get("fijada") === "on",
    categoriaIds: formData.getAll("categoriaIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
  });
  redirect("/admin/noticias/nueva");
}

export default async function Noticias() {
  const categorias = await getCategorias();
  const tags = await getTags();
  return (
    <NoticiaForm
      categorias={categorias}
      tags={tags}
      onCreate={createNoticiaAction}
    />
  );
}
