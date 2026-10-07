import ListError from "@/components/admin/ListError";
import CategoriasTable from "@/components/admin/CategoriasTable";
import { buttonVariants } from "@/components/ui/button";
import { deleteCategoria, getCategorias } from "@/lib/api/categorias";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Categorias({
  searchParams,
}: {
  searchParams: Promise<{ orderBy?: string; direction?: string }>;
}) {
  const { orderBy, direction } = await searchParams;
  const o = orderBy === "titulo" ? "titulo" : "fecha";
  const d = direction === "asc" ? "asc" : "desc";

  let categorias: Awaited<ReturnType<typeof getCategorias>> = [];
  let loadError = false;
  try {
    categorias = await getCategorias({ orderBy: o, direction: d });
  } catch {
    loadError = true;
  }

  async function deleteCategoriaAction(id: string): Promise<void> {
    "use server";
    await deleteCategoria(id);
    revalidatePath("/admin/categorias");
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex flex-row flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold">Categorías</h1>
        <Link
          className={buttonVariants({ variant: "outline", size: "sm" })}
          href={`/admin/categorias/nueva`}
        >
          Añadir categoría
        </Link>
      </div>
      <CategoriasTable
        categorias={categorias}
        orderBy={o}
        direction={d}
        onDelete={deleteCategoriaAction}
      />
      {loadError && (
        <ListError message="Comprueba la conexión con la API e inténtalo de nuevo." />
      )}
    </div>
  );
}
