import { notFound, redirect } from "next/navigation";
import CategoriaForm from "@/components/admin/CategoriaForm";
import {
  getCategoriaById,
  getCategorias,
  updateCategoria,
} from "@/lib/api/categorias";

export default async function EditarCategoria({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categoriaRes, categoriasRes] = await Promise.allSettled([
    getCategoriaById(id),
    getCategorias(),
  ]);

  if (categoriaRes.status !== "fulfilled") {
    notFound();
  }
  const categoria = categoriaRes.value;
  const categorias =
    categoriasRes.status === "fulfilled" ? categoriasRes.value : [];

  async function updateCategoriaAction(formData: FormData): Promise<void> {
    "use server";
    await updateCategoria(id, {
      nombre: String(formData.get("nombre") ?? ""),
      descripcion: String(formData.get("descripcion") ?? "").trim() || null,
      categoriaPadreId:
        String(formData.get("categoriaPadreId") ?? "").trim() || null,
    });
    redirect("/admin/categorias");
  }

  return (
    <CategoriaForm
      categorias={categorias}
      excludeId={id}
      mode="edit"
      initial={{
        nombre: categoria.nombre,
        descripcion: categoria.descripcion,
        categoriaPadreId: categoria.categoriaPadreId,
      }}
      onSubmit={updateCategoriaAction}
    />
  );
}
