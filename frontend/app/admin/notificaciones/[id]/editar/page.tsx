import { notFound, redirect } from "next/navigation";
import NotificacionForm from "@/components/admin/NotificacionForm";
import {
  createNotificacion,
  getNotificacionById,
  updateNotificacion,
} from "@/lib/api/notificaciones";
import type { NotificacionDto } from "@/types";
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

export default async function EditarNotificacion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const notificacion = await getNotificacionById(id).catch(() => null);

  if (notificacion === null) {
    notFound();
  }

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
      onCreate={onCreate}
      onUpdate={onUpdate}
    />
  );
}
