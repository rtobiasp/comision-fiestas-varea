import { redirect } from "next/navigation";
import ProgramacionForm from "@/components/admin/ProgramacionForm";
import {
  createDiaProgramacion,
  createEventoProgramacion,
  createProgramacion,
} from "@/lib/api/programaciones";
import { parseProgramacionFormData } from "@/lib/api/programacion-form-data";

async function createProgramacionAction(formData: FormData): Promise<void> {
  "use server";
  const parsed = parseProgramacionFormData(formData);
  const programacion = await createProgramacion({ nombre: parsed.nombre });
  for (const dia of parsed.dias) {
    const createdDia = await createDiaProgramacion({
      programacionId: programacion.id,
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
  }
  redirect("/admin/programaciones");
}

export default function NuevaProgramacion() {
  return <ProgramacionForm mode="create" onSubmit={createProgramacionAction} />;
}
