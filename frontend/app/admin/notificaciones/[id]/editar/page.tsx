import { notFound, redirect } from "next/navigation";
import NotificacionForm from "@/components/admin/NotificacionForm";
import { createCategoria, getCategorias } from "@/lib/api/categorias";
import {
  createNotificacion,
  getNotificacionById,
  updateNotificacion,
} from "@/lib/api/notificaciones";
import { createTag, getTags } from "@/lib/api/tags";
import type { CategoriaDto, NotificacionDto, TagDto } from "@/types";
import { revalidatePath } from "next/cache";

async function onCreate(formData: FormData): Promise<NotificacionDto> {
  "use server";
  const rawFecha = String(formData.get("fechaCaducidad") ?? "").trim();

  const result = await createNotificacion({
    titulo: String(formData.get("titulo") ?? "").trim(),
    mensaje: String(formData.get("mensaje") ?? "").trim(),
    nivel: String(formData.get("nivel") ?? "").trim(),
    fechaCaducidad: rawFecha ? new Date(rawFecha).toISOString() : null,
    fijada: formData.get("fijada") === "on",
    categoriaIds: formData.getAll("categoriaIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
  });
  revalidatePath("/admin/notificaciones");
  return result;
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

export default async function EditarNotificacion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [notificacionRes, categoriasRes, tagsRes] = await Promise.allSettled([
    getNotificacionById(id).catch(() => null),
    getCategorias(),
    getTags(),
  ]);

  const notificacion =
    notificacionRes.status === "fulfilled" ? notificacionRes.value : null;

  if (notificacion === null) {
    notFound();
  }

  const categorias =
    categoriasRes.status === "fulfilled" ? categoriasRes.value : [];
  const tags = tagsRes.status === "fulfilled" ? tagsRes.value : [];
  const categoriasError = categoriasRes.status !== "fulfilled";
  const tagsError = tagsRes.status !== "fulfilled";

  async function onUpdate(formData: FormData): Promise<void> {
    "use server";
    const rawFecha = String(formData.get("fechaCaducidad") ?? "").trim();

    await updateNotificacion(id, {
      titulo: String(formData.get("titulo") ?? "").trim(),
      mensaje: String(formData.get("mensaje") ?? "").trim(),
      nivel: String(formData.get("nivel") ?? "").trim(),
      fechaCaducidad: rawFecha ? new Date(rawFecha).toISOString() : null,
      publicada: formData.get("publicada") === "on",
      fijada: formData.get("fijada") === "on",
      categoriaIds: formData.getAll("categoriaIds").map(String),
      tagIds: formData.getAll("tagIds").map(String),
    });
    revalidatePath("/admin/notificaciones");
    redirect("/admin/notificaciones");
  }

  return (
    <NotificacionForm
      isNew={false}
      notificacion={notificacion}
      categorias={categorias}
      tags={tags}
      categoriasError={categoriasError}
      tagsError={tagsError}
      onCreate={onCreate}
      onUpdate={onUpdate}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
