import { notFound, redirect } from "next/navigation";
import EventoForm from "@/components/admin/EventoForm";
import { getCategorias, createCategoria } from "@/lib/api/categorias";
import { getTags, createTag } from "@/lib/api/tags";
import { getEventoById, updateEvento } from "@/lib/api/eventos";
import { parseOptionalDateTimeLocalToIso } from "@/lib/date";
import type { CategoriaDto, TagDto } from "@/types";

async function createCategoriaAction(
  formData: FormData,
): Promise<CategoriaDto> {
  "use server";
  return createCategoria({
    nombre: String(formData.get("nombre") ?? ""),
  });
}

async function createTagAction(formData: FormData): Promise<TagDto> {
  "use server";
  return createTag({ nombre: String(formData.get("nombre") ?? "") });
}

export default async function EditarEvento({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [eventoRes, categoriasRes, tagsRes] = await Promise.allSettled([
    getEventoById(id),
    getCategorias(),
    getTags(),
  ]);

  if (eventoRes.status !== "fulfilled" || eventoRes.value == null) {
    notFound();
  }
  const evento = eventoRes.value;
  const categorias =
    categoriasRes.status === "fulfilled" ? categoriasRes.value : [];
  const tags = tagsRes.status === "fulfilled" ? tagsRes.value : [];
  const categoriasError = categoriasRes.status !== "fulfilled";
  const tagsError = tagsRes.status !== "fulfilled";

  async function updateEventoAction(formData: FormData): Promise<void> {
    "use server";
    const fechaInicioRaw = String(formData.get("fechaInicio") ?? "");
    const fechaInicioIso = parseOptionalDateTimeLocalToIso(fechaInicioRaw);
    if (fechaInicioIso === null) {
      throw new Error("La fecha de inicio es obligatoria.");
    }
    const aforoRaw = String(formData.get("aforo") ?? "").trim();
    await updateEvento(id, {
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

  return (
    <EventoForm
      categorias={categorias}
      tags={tags}
      categoriasError={categoriasError}
      tagsError={tagsError}
      mode="edit"
      initial={{
        titulo: evento.titulo,
        descripcion: evento.descripcion,
        lugar: evento.lugar,
        fechaInicio: evento.fechaInicio,
        fechaFin: evento.fechaFin ?? null,
        aforo: evento.aforo ?? null,
        imagenPortada: evento.imagenPortada ?? null,
        fijada: evento.fijada,
        categoriaIds: evento.categorias.map((c) => c.id),
        tagIds: evento.tags.map((t) => t.id),
      }}
      onSubmit={updateEventoAction}
      onCreateCategoria={createCategoriaAction}
      onCreateTag={createTagAction}
    />
  );
}
