import CategoriasTable from "@/components/admin/CategoriasTable";
import { buttonVariants } from "@/components/ui/button";
import { deleteCategoria, getCategorias } from "@/lib/api/categorias";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function Categorias() {
  const categorias = await getCategorias();

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
      <CategoriasTable categorias={categorias} onDelete={deleteCategoriaAction} />
    </div>
  );
}
