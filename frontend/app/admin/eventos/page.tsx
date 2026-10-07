import { Suspense } from "react";
import ListError from "@/components/admin/ListError";
import EventosTable from "@/components/admin/EventosTable";
import TablePagination from "@/components/admin/TablePagination";
import { buttonVariants } from "@/components/ui/button";
import { getEventos, deleteEvento } from "@/lib/api/eventos";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Eventos({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    orderBy?: string;
    direction?: string;
    publicada?: string;
  }>;
}) {
  const { page = "1", limit = "25", orderBy, direction, publicada } =
    await searchParams;

  const p = Math.max(1, Number(page)) || 1;
  const l = [10, 25, 50, 100].includes(Number(limit)) ? Number(limit) : 25;
  const offset = (p - 1) * l;
  const o = orderBy === "titulo" ? "titulo" : "fecha";
  const d = direction === "asc" ? "asc" : "desc";
  const pub =
    publicada === "true" ? true : publicada === "false" ? false : undefined;

  let eventos: Awaited<ReturnType<typeof getEventos>> = [];
  let loadError = false;
  try {
    eventos = await getEventos(offset, l, {
      orderBy: o,
      direction: d,
      publicada: pub,
    });
  } catch {
    loadError = true;
  }

  async function deleteEventoAction(id: string): Promise<void> {
    "use server";
    await deleteEvento(id);
    revalidatePath("/admin/eventos");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Eventos</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/eventos/nueva`}
        >
          Añadir evento
        </Link>
      </div>
      <EventosTable
        eventos={eventos}
        orderBy={o}
        direction={d}
        publicada={pub}
        onDelete={deleteEventoAction}
      />
      {loadError && (
        <ListError message="Comprueba la conexión con la API e inténtalo de nuevo." />
      )}
      <Suspense>
        <TablePagination page={p} limit={l} hasNext={eventos.length === l} />
      </Suspense>
    </div>
  );
}
