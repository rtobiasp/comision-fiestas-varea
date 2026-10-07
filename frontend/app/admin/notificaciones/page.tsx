import { Suspense } from "react";
import NotificacionesTable from "@/components/admin/NotificacionesTable";
import TablePagination from "@/components/admin/TablePagination";
import { buttonVariants } from "@/components/ui/button";
import { deleteNotificacion, getAllNotificaciones } from "@/lib/api/notificaciones";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Notificaciones({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string }>;
}) {
  const { page = "1", limit = "10" } = await searchParams;

  const p = Math.max(1, Number(page)) || 1;
  const l = [10, 25, 50, 100].includes(Number(limit)) ? Number(limit) : 25;
  const offset = (p - 1) * l;

  const notificaciones = await getAllNotificaciones(offset, l);

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
      <Suspense>
        <TablePagination page={p} limit={l} hasNext={notificaciones.length === l} />
      </Suspense>
    </div>
  );
}
