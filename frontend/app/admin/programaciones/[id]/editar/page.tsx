import { notFound, redirect } from "next/navigation";
import ProgramacionForm from "@/components/admin/ProgramacionForm";
import {
  createDiaProgramacion,
  createEventoProgramacion,
  deleteDiaProgramacion,
  deleteEventoProgramacion,
  getProgramacionById,
  updateDiaProgramacion,
  updateEventoProgramacion,
  updateProgramacion,
} from "@/lib/api/programaciones";
import { parseProgramacionFormData } from "@/lib/api/programacion-form-data";

export default async function EditarProgramacion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let programacion: Awaited<ReturnType<typeof getProgramacionById>>;
  try {
    programacion = await getProgramacionById(id);
  } catch {
    notFound();
  }

  async function updateProgramacionAction(formData: FormData): Promise<void> {
    "use server";
    const parsed = parseProgramacionFormData(formData);
    const current = await getProgramacionById(id);
    await updateProgramacion(id, { nombre: parsed.nombre });

    const parsedDiaIds = new Set(
      parsed.dias.map((d) => d.id).filter((v): v is string => v !== null),
    );
    for (const existingDia of current.dias) {
      if (!parsedDiaIds.has(existingDia.id)) {
        for (const existingEvento of existingDia.eventos) {
          await deleteEventoProgramacion(existingEvento.id);
        }
        await deleteDiaProgramacion(existingDia.id);
      }
    }

    for (const dia of parsed.dias) {
      if (dia.id === null) {
        const createdDia = await createDiaProgramacion({
          programacionId: id,
          fecha: dia.fecha,
        });
        for (const evento of dia.eventos) {
          await createEventoProgramacion({
            diaId: createdDia.id,
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            fechaInicio: evento.fechaInicio,
          });
        }
      } else {
        await updateDiaProgramacion(dia.id, { fecha: dia.fecha });
        const existingDia = current.dias.find((d) => d.id === dia.id);
        const parsedEventoIds = new Set(
          dia.eventos
            .map((e) => e.id)
            .filter((v): v is string => v !== null),
        );
        if (existingDia) {
          for (const existingEvento of existingDia.eventos) {
            if (!parsedEventoIds.has(existingEvento.id)) {
              await deleteEventoProgramacion(existingEvento.id);
            }
          }
        }
        for (const evento of dia.eventos) {
          if (evento.id === null) {
            await createEventoProgramacion({
              diaId: dia.id,
              nombre: evento.nombre,
              descripcion: evento.descripcion,
              fechaInicio: evento.fechaInicio,
            });
          } else {
            await updateEventoProgramacion(evento.id, {
              nombre: evento.nombre,
              descripcion: evento.descripcion,
              fechaInicio: evento.fechaInicio,
            });
          }
        }
      }
    }
    redirect("/admin/programaciones");
  }

  return (
    <ProgramacionForm
      mode="edit"
      initial={{
        nombre: programacion.nombre,
        dias: programacion.dias.map((d) => ({
          id: d.id,
          fecha: d.fecha,
          eventos: d.eventos.map((e) => ({
            id: e.id,
            nombre: e.nombre,
            descripcion: e.descripcion,
            fechaInicio: e.fechaInicio,
          })),
        })),
      }}
      onSubmit={updateProgramacionAction}
    />
  );
}
