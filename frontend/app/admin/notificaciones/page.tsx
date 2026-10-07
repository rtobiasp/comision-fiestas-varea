import NotificacionesTable from "@/components/admin/NotificacionesTable";
import { buttonVariants } from "@/components/ui/button";
import { deleteNotificacion, getAllNotificaciones } from "@/lib/api/notificaciones";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Notificaciones() {
  const notificaciones = await getAllNotificaciones();

  async function deleteNotificacionAction(id: string): Promise<void> {
    "use server";
    await deleteNotificacion(id);
    revalidatePath("/admin/notificaciones");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Notificaciones</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/notificaciones/nueva`}
        >
          Añadir notificación
        </Link>
      </div>
      <NotificacionesTable
        notificaciones={notificaciones}
        onDelete={deleteNotificacionAction}
      />
    </div>
  );
}
