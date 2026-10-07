import { redirect } from "next/navigation";
import NotificacionForm from "@/components/admin/NotificacionForm";
import { createCategoria, getCategorias } from "@/lib/api/categorias";
import { createNotificacion } from "@/lib/api/notificaciones";
import { createTag, getTags } from "@/lib/api/tags";
import { parseOptionalDateTimeLocalToIso } from "@/lib/date";
import type { CategoriaDto, TagDto } from "@/types";
import { revalidatePath } from "next/cache";

async function createNotificacionAction(formData: FormData): Promise<void> {
  "use server";
  const rawFecha = String(formData.get("fechaCaducidad") ?? "");
  await createNotificacion({
    titulo: String(formData.get("titulo") ?? "").trim(),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
    nivel: String(formData.get("nivel") ?? "").trim(),
    fechaCaducidad: parseOptionalDateTimeLocalToIso(rawFecha),
    fijada: formData.get("fijada") === "on",
    categoriaIds: formData.getAll("categoriaIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
  });
  revalidatePath("/admin/notificaciones");
  redirect("/admin/notificaciones");
}

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

const emptyNotificacion = {
  id: "",
  titulo: "",
  mensaje: "",
  nivel: "Info",
  fechaCaducidad: null,
  publicada: false,
  fijada: false,
} as const;

export default async function NuevaNotificacion() {
  let categorias: CategoriaDto[] = [];
  let tags: TagDto[] = [];
  let categoriasError = false;
  let tagsError = false;
  try {
    categorias = await getCategorias();
  } catch {
    categoriasError = true;
  }
  try {
    tags = await getTags();
  } catch {
    tagsError = true;
  }

  return (
    <NotificacionForm
      mode="create"
      notificacion={emptyNotificacion}
      categorias={categorias}
      tags={tags}
      categoriasError={categoriasError}
      tagsError={tagsError}
      onSubmit={createNotificacionAction}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
