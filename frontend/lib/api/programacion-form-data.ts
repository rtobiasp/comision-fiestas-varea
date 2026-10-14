export type ParsedEventoProgramacion = {
  id: string | null;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
};

export type ParsedDiaProgramacion = {
  id: string | null;
  fecha: string;
  eventos: ParsedEventoProgramacion[];
};

export function parseDateInputToIso(raw: string): string {
  const value = raw.trim();
  const time = Date.parse(value);
  if (Number.isNaN(time)) throw new Error("La fecha no es válida.");
  return new Date(time).toISOString();
}

export function parseProgramacionFormData(formData: FormData): {
  nombre: string;
  dias: ParsedDiaProgramacion[];
} {
  const nombre = String(formData.get("nombre") ?? "").trim();
  const count = Number(formData.get("diasCount") ?? "0");
  const dias: ParsedDiaProgramacion[] = [];
  for (let i = 0; i < count; i += 1) {
    const idRaw = String(formData.get(`dias[${i}].id`) ?? "").trim();
    const fechaRaw = String(formData.get(`dias[${i}].fecha`) ?? "");
    const ecount = Number(formData.get(`dias[${i}].eventosCount`) ?? "0");
    const eventos: ParsedEventoProgramacion[] = [];
    for (let j = 0; j < ecount; j += 1) {
      const eidRaw = String(
        formData.get(`dias[${i}].eventos[${j}].id`) ?? "",
      ).trim();
      eventos.push({
        id: eidRaw === "" ? null : eidRaw,
        nombre: String(
          formData.get(`dias[${i}].eventos[${j}].nombre`) ?? "",
        ).trim(),
        descripcion: String(
          formData.get(`dias[${i}].eventos[${j}].descripcion`) ?? "",
        ),
        fechaInicio: parseDateInputToIso(
          String(formData.get(`dias[${i}].eventos[${j}].fechaInicio`) ?? ""),
        ),
      });
    }
    dias.push({
      id: idRaw === "" ? null : idRaw,
      fecha: parseDateInputToIso(fechaRaw),
      eventos,
    });
  }
  return { nombre, dias };
}
