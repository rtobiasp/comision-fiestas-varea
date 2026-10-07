import { redirect } from "next/navigation";
import CategoriaForm from "@/components/admin/CategoriaForm";
import { createCategoria, getCategorias } from "@/lib/api/categorias";

async function createCategoriaAction(formData: FormData): Promise<void> {
  "use server";
  await createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
    descripcion: String(formData.get("descripcion") ?? "").trim() || null,
    categoriaPadreId:
      String(formData.get("categoriaPadreId") ?? "").trim() || null,
  });
  redirect("/admin/categorias");
}

export default async function NuevaCategoria() {
  const categorias = await getCategorias().catch(() => []);
  return (
    <CategoriaForm
      categorias={categorias}
      mode="create"
      onSubmit={createCategoriaAction}
    />
  );
}
