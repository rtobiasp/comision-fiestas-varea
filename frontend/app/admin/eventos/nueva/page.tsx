import { redirect } from "next/navigation";
import EventoForm from "@/components/admin/EventoForm";
import { getCategorias, createCategoria } from "@/lib/api/categorias";
import { getTags, createTag } from "@/lib/api/tags";
import { createEvento } from "@/lib/api/eventos";
import { parseOptionalDateTimeLocalToIso } from "@/lib/date";
import type { CategoriaDto, TagDto } from "@/types";

async function createEventoAction(formData: FormData): Promise<void> {
  "use server";
  const fechaInicioRaw = String(formData.get("fechaInicio") ?? "");
  const fechaInicioIso = parseOptionalDateTimeLocalToIso(fechaInicioRaw);
  if (fechaInicioIso === null) {
    throw new Error("La fecha de inicio es obligatoria.");
  }
  const aforoRaw = String(formData.get("aforo") ?? "").trim();
  await createEvento({
    titulo: String(formData.get("titulo") ?? "").trim(),
    descripcion: String(formData.get("descripcion") ?? ""),
    lugar: String(formData.get("lugar") ?? "").trim(),
    fechaInicio: fechaInicioIso,
    fechaFin: parseOptionalDateTimeLocalToIso(String(formData.get("fechaFin") ?? "")),
    imagenPortada: String(formData.get("imagenPortada") ?? "").trim() || null,
    publicada: formData.get("accion") === "guardar",
    fijada: formData.get("fijada") === "on",
    aforo: aforoRaw === "" ? null : Number(aforoRaw),
    categoriaIds: formData.getAll("categoriaIds").map(String),
    tagIds: formData.getAll("tagIds").map(String),
  });
  redirect("/admin/eventos");
}

async function createCategoriaAction(
  formData: FormData,
): Promise<CategoriaDto> {
  "use server";
  const categoria = await createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
  });
  return categoria;
}

async function createTagAction(formData: FormData): Promise<TagDto> {
  "use server";
  return createTag({ nombre: String(formData.get("nombre") ?? "") });
}

export default async function NuevoEvento() {
  let categorias: CategoriaDto[] = [];
  let tags: TagDto[] = [];
  let categoriasError = false;
  let tagsError = false;
  try {
    categorias = await getCategorias();
  } catch {
    categoriasError = true;
  }
  try {
    tags = await getTags();
  } catch {
    tagsError = true;
  }
  return (
    <EventoForm
      categorias={categorias}
      tags={tags}
      categoriasError={categoriasError}
      tagsError={tagsError}
      mode="create"
      onSubmit={createEventoAction}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
