import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import NoticiaForm from "@/components/admin/NoticiaForm";
import { getCategorias, createCategoria } from "@/lib/api/categorias";
import { getTags } from "@/lib/api/tags";
import { createNoticia } from "@/lib/api/noticias";

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

async function createCategoriaAction(formData: FormData): Promise<void> {
  "use server";
  await createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
  });
  revalidatePath("/admin/noticias/nueva");
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
    />
  );
}
