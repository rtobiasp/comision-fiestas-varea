import { Suspense } from "react";
import ListError from "@/components/admin/ListError";
import ProgramacionesTable from "@/components/admin/ProgramacionesTable";
import TablePagination from "@/components/admin/TablePagination";
import { buttonVariants } from "@/components/ui/button";
import { getProgramaciones, deleteProgramacion } from "@/lib/api/programaciones";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Programaciones({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    limit?: string;
    orderBy?: string;
    direction?: string;
  }>;
}) {
  const { page = "1", limit = "25", orderBy, direction } = await searchParams;

  const p = Math.max(1, Number(page)) || 1;
  const l = [10, 25, 50, 100].includes(Number(limit)) ? Number(limit) : 25;
  const offset = (p - 1) * l;
  const o = orderBy === "nombre" ? "nombre" : "fecha";
  const d = direction === "asc" ? "asc" : "desc";

  let programaciones: Awaited<ReturnType<typeof getProgramaciones>> = [];
  let loadError = false;
  try {
    programaciones = await getProgramaciones(offset, l, {
      orderBy: o,
      direction: d,
    });
  } catch {
    loadError = true;
  }

  async function deleteProgramacionAction(id: string): Promise<void> {
    "use server";
    await deleteProgramacion(id);
    revalidatePath("/admin/programaciones");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Programación</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/programaciones/nueva`}
        >
          Añadir programación
        </Link>
      </div>
      <ProgramacionesTable
        programaciones={programaciones}
        orderBy={o}
        direction={d}
        onDelete={deleteProgramacionAction}
      />
      {loadError && (
        <ListError message="Comprueba la conexión con la API e inténtalo de nuevo." />
      )}
      <Suspense>
        <TablePagination
          page={p}
          limit={l}
          hasNext={programaciones.length === l}
        />
      </Suspense>
    </div>
  );
}
