"use client";

import { useActionState, useRef, useState } from "react";
import { ChevronDown, Plus, Trash2, TriangleAlert } from "lucide-react";
import Tiptap from "@/components/ui/tiptap/Tiptap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  isRedirectError,
  toFormError,
  type FormErrorState,
} from "@/lib/api/form-error";
import { FormErrors, preventEnterSubmit } from "./form-helpers";

export type ProgramacionFormEventoInitial = {
  id?: string;
  nombre: string;
  descripcion: string;
  fechaInicio: string;
};

export type ProgramacionFormDiaInitial = {
  id?: string;
  fecha: string;
  eventos: ProgramacionFormEventoInitial[];
};

export type ProgramacionFormInitial = {
  nombre: string;
  dias: ProgramacionFormDiaInitial[];
};

type EventoState = {
  key: string;
  id: string | null;
  nombre: string;
  descripcion: string;
  horaInicio: string;
};

type DiaState = {
  key: string;
  id: string | null;
  fecha: string;
  eventos: EventoState[];
};

function toDateInput(value: string): string {
  if (value.trim() === "") return "";
  const t = Date.parse(value);
  if (Number.isNaN(t)) return "";
  return new Date(t).toISOString().slice(0, 10);
}

function toTimeInput(value: string): string {
  if (value.trim() === "") return "";
  const t = Date.parse(value);
  if (Number.isNaN(t)) return "";
  return new Date(t).toISOString().slice(11, 16);
}

function combineFechaHora(fecha: string, hora: string): string {
  if (fecha.trim() === "" || hora.trim() === "") return "";
  const t = Date.parse(`${fecha}T${hora}`);
  if (Number.isNaN(t)) return "";
  return new Date(t).toISOString();
}

function formatDiaCorto(fecha: string): string {
  if (fecha.trim() === "") return "Sin fecha";
  const t = Date.parse(`${fecha}T00:00:00`);
  if (Number.isNaN(t)) return fecha;
  return new Date(t).toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function ProgramacionForm({
  initial,
  mode = "create",
  title,
  onSubmit,
}: {
  initial?: ProgramacionFormInitial;
  mode?: "create" | "edit";
  title?: string;
  onSubmit: (formData: FormData) => Promise<void>;
}) {
  const isEdit = mode === "edit";
  const heading = title ?? (isEdit ? "Editar programación" : "Añadir programación");
  const keyRef = useRef(0);
  const nextKey = () => {
    keyRef.current += 1;
    return `k${keyRef.current}`;
  };
  const [nombreLen, setNombreLen] = useState(initial?.nombre.length ?? 0);
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});
  const [dias, setDias] = useState<DiaState[]>(() => {
    let n = 0;
    const initKey = () => {
      n += 1;
      return `init-${n}`;
    };
    return (initial?.dias ?? []).map((d) => ({
      key: initKey(),
      id: d.id ?? null,
      fecha: toDateInput(d.fecha),
      eventos: d.eventos.map((e) => ({
        key: initKey(),
        id: e.id ?? null,
        nombre: e.nombre,
        descripcion: e.descripcion,
        horaInicio: toTimeInput(e.fechaInicio),
      })),
    }));
  });

  function isOpen(key: string): boolean {
    return openMap[key] !== false;
  }

  function toggleOpen(key: string) {
    setOpenMap((prev) => ({ ...prev, [key]: !(prev[key] !== false) }));
  }

  type SubmitState = { ok: true } | FormErrorState | null;

  const [submitState, formAction, isPending] = useActionState(
    async (_prev: SubmitState, formData: FormData): Promise<SubmitState> => {
      const fieldErrors: Record<string, string[]> = {};
      const nombre = String(formData.get("nombre") ?? "");
      if (nombre.trim() === "") {
        fieldErrors.nombre = ["El nombre no puede estar vacío."];
      } else if (nombre.length > 200) {
        fieldErrors.nombre = ["El nombre no puede exceder los 200 caracteres."];
      }
      const count = Number(formData.get("diasCount") ?? "0");
      if (!Number.isInteger(count) || count < 0) {
        fieldErrors.general = ["El número de días no es válido."];
      } else {
        for (let i = 0; i < count; i += 1) {
          const fecha = String(formData.get(`dias[${i}].fecha`) ?? "");
          if (fecha.trim() === "") {
            fieldErrors[`dia-${i}-fecha`] = ["La fecha del día es obligatoria."];
          } else if (Number.isNaN(Date.parse(fecha))) {
            fieldErrors[`dia-${i}-fecha`] = ["La fecha del día no es válida."];
          }
          const ecount = Number(
            formData.get(`dias[${i}].eventosCount`) ?? "0",
          );
          for (let j = 0; j < ecount; j += 1) {
            const enombre = String(
              formData.get(`dias[${i}].eventos[${j}].nombre`) ?? "",
            );
            const edesc = String(
              formData.get(`dias[${i}].eventos[${j}].descripcion`) ?? "",
            );
            const einicio = String(
              formData.get(`dias[${i}].eventos[${j}].fechaInicio`) ?? "",
            );
            if (enombre.trim() === "") {
              fieldErrors[`dia-${i}-evento-${j}-nombre`] = [
                "El nombre del evento no puede estar vacío.",
              ];
            } else if (enombre.length > 200) {
              fieldErrors[`dia-${i}-evento-${j}-nombre`] = [
                "El nombre del evento no puede exceder los 200 caracteres.",
              ];
            }
            if (edesc.trim() === "") {
              fieldErrors[`dia-${i}-evento-${j}-descripcion`] = [
                "La descripción del evento es obligatoria.",
              ];
            } else if (edesc.length > 100000) {
              fieldErrors[`dia-${i}-evento-${j}-descripcion`] = [
                "La descripción no puede exceder los 100000 caracteres.",
              ];
            }
            if (einicio.trim() === "") {
              fieldErrors[`dia-${i}-evento-${j}-fechaInicio`] = [
                "La hora de inicio es obligatoria.",
              ];
            } else if (Number.isNaN(Date.parse(einicio))) {
              fieldErrors[`dia-${i}-evento-${j}-fechaInicio`] = [
                "La hora de inicio no es válida.",
              ];
            }
          }
        }
      }
      if (Object.keys(fieldErrors).length > 0) {
        setOpenMap({});
        return {
          ok: false,
          message: "Revisa los campos marcados.",
          fieldErrors,
        };
      }
      try {
        await onSubmit(formData);
        return { ok: true };
      } catch (e) {
        if (isRedirectError(e)) throw e;
        return { ok: false, ...toFormError(e) };
      }
    },
    null,
  );

  const fieldErrors =
    submitState !== null && !submitState.ok ? submitState.fieldErrors : {};
  const nombreErrors = fieldErrors.nombre ?? [];
  const otherErrors = Object.entries(fieldErrors).filter(
    ([key]) => key === "general" || key.startsWith("dia-") === false,
  );

  function addDia() {
    const key = nextKey();
    setDias((prev) => [
      ...prev,
      {
        key,
        id: null,
        fecha: "",
        eventos: [
          {
            key: nextKey(),
            id: null,
            nombre: "",
            descripcion: "",
            horaInicio: "",
          },
        ],
      },
    ]);
    setOpenMap((prev) => ({ ...prev, [key]: true }));
  }

  function removeDia(key: string) {
    setDias((prev) => prev.filter((d) => d.key !== key));
  }

  function updateDia(key: string, patch: Partial<Pick<DiaState, "fecha">>) {
    setDias((prev) => prev.map((d) => (d.key === key ? { ...d, ...patch } : d)));
  }

  function addEvento(diaKey: string) {
    const key = nextKey();
    setDias((prev) =>
      prev.map((d) =>
        d.key === diaKey
          ? {
              ...d,
              eventos: [
                ...d.eventos,
                {
                  key,
                  id: null,
                  nombre: "",
                  descripcion: "",
                  horaInicio: "",
                },
              ],
            }
          : d,
      ),
    );
    setOpenMap((prev) => ({ ...prev, [key]: true }));
  }

  function removeEvento(diaKey: string, eventoKey: string) {
    setDias((prev) =>
      prev.map((d) =>
        d.key === diaKey
          ? { ...d, eventos: d.eventos.filter((e) => e.key !== eventoKey) }
          : d,
      ),
    );
  }

  function updateEvento(
    diaKey: string,
    eventoKey: string,
    patch: Partial<Pick<EventoState, "nombre" | "descripcion" | "horaInicio">>,
  ) {
    setDias((prev) =>
      prev.map((d) =>
        d.key === diaKey
          ? {
              ...d,
              eventos: d.eventos.map((e) =>
                e.key === eventoKey ? { ...e, ...patch } : e,
              ),
            }
          : d,
      ),
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <h1 className="text-2xl font-semibold">{heading}</h1>
      {submitState !== null && !submitState.ok && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>No se ha podido guardar la programación</AlertTitle>
          <AlertDescription>
            <p>{submitState.message}</p>
            <FormErrors errors={otherErrors} />
          </AlertDescription>
        </Alert>
      )}
      <form
        id="programacion-form"
        action={formAction}
        aria-busy={isPending}
        className="grid items-start gap-4 lg:grid-cols-[1fr_300px]"
      >
        <div className="flex min-w-0 flex-col gap-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre *</Label>
            <Input
              type="text"
              id="nombre"
              name="nombre"
              required
              maxLength={200}
              placeholder="Fiestas de Varea 2026"
              defaultValue={initial?.nombre ?? ""}
              aria-invalid={nombreErrors.length > 0}
              onKeyDown={preventEnterSubmit}
              onChange={(e) => setNombreLen(e.target.value.length)}
              readOnly={isPending}
              className="h-12 text-xl font-medium"
            />
            <div className="flex justify-end">
              <p
                className={`text-xs ${nombreLen > 200 ? "text-destructive" : "text-muted-foreground"}`}
              >
                {nombreLen}/200
              </p>
            </div>
            {nombreErrors.length > 0 && (
              <div>
                {nombreErrors.map((m, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {m}
                  </p>
                ))}
              </div>
            )}
          </div>

          <input type="hidden" name="diasCount" value={dias.length} readOnly />

          {dias.map((dia, i) => {
            const fechaErrors = fieldErrors[`dia-${i}-fecha`] ?? [];
            const diaOpen = isOpen(dia.key);
            return (
              <Card key={dia.key}>
                <Collapsible open={diaOpen} onOpenChange={() => toggleOpen(dia.key)}>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <CollapsibleTrigger
                      type="button"
                      className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                    >
                      <ChevronDown
                        className={cn(
                          "size-4 shrink-0 transition-transform",
                          diaOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                      <span className="truncate text-base font-semibold">
                        Día {i + 1} · {formatDiaCorto(dia.fecha)}
                      </span>
                    </CollapsibleTrigger>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPending}
                      onClick={() => removeDia(dia.key)}
                    >
                      <Trash2 className="size-4" aria-hidden="true" />
                      Quitar día
                    </Button>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="flex flex-col gap-4">
                      <input
                        type="hidden"
                        name={`dias[${i}].id`}
                        value={dia.id ?? ""}
                        readOnly
                      />
                      <input
                        type="hidden"
                        name={`dias[${i}].eventosCount`}
                        value={dia.eventos.length}
                        readOnly
                      />
                      <div className="grid gap-2">
                        <Label htmlFor={`dia-${dia.key}-fecha`}>Fecha *</Label>
                        <Input
                          type="date"
                          id={`dia-${dia.key}-fecha`}
                          name={`dias[${i}].fecha`}
                          required
                          value={dia.fecha}
                          onChange={(e) =>
                            updateDia(dia.key, { fecha: e.target.value })
                          }
                          readOnly={isPending}
                          aria-invalid={fechaErrors.length > 0}
                          className="max-w-60"
                        />
                        {fechaErrors.length > 0 && (
                          <div>
                            {fechaErrors.map((m, k) => (
                              <p key={k} className="text-sm text-destructive">
                                {m}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>

                      {dia.eventos.map((evento, j) => {
                        const nErrors =
                          fieldErrors[`dia-${i}-evento-${j}-nombre`] ?? [];
                        const dErrors =
                          fieldErrors[`dia-${i}-evento-${j}-descripcion`] ?? [];
                        const fErrors =
                          fieldErrors[`dia-${i}-evento-${j}-fechaInicio`] ?? [];
                        const eventoOpen = isOpen(evento.key);
                        return (
                          <div
                            key={evento.key}
                            className="rounded-lg border"
                          >
                            <Collapsible
                              open={eventoOpen}
                              onOpenChange={() => toggleOpen(evento.key)}
                            >
                              <div className="flex items-center gap-2 p-3">
                                <CollapsibleTrigger
                                  type="button"
                                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-left"
                                >
                                  <ChevronDown
                                    className={cn(
                                      "size-4 shrink-0 transition-transform",
                                      eventoOpen && "rotate-180",
                                    )}
                                    aria-hidden="true"
                                  />
                                  <span className="truncate text-sm font-medium">
                                    {evento.nombre.trim() !== ""
                                      ? evento.nombre
                                      : `Evento ${j + 1}`}
                                  </span>
                                </CollapsibleTrigger>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={isPending}
                                  onClick={() =>
                                    removeEvento(dia.key, evento.key)
                                  }
                                >
                                  <Trash2 className="size-4" aria-hidden="true" />
                                  Quitar evento
                                </Button>
                              </div>
                              <CollapsibleContent className="flex flex-col gap-3 px-3 pb-3">
                                <input
                                  type="hidden"
                                  name={`dias[${i}].eventos[${j}].id`}
                                  value={evento.id ?? ""}
                                  readOnly
                                />
                                <input
                                  type="hidden"
                                  name={`dias[${i}].eventos[${j}].fechaInicio`}
                                  value={combineFechaHora(
                                    dia.fecha,
                                    evento.horaInicio,
                                  )}
                                  readOnly
                                />
                                <div className="grid gap-2">
                                  <Label htmlFor={`ev-${evento.key}-nombre`}>
                                    Nombre *
                                  </Label>
                                  <Input
                                    type="text"
                                    id={`ev-${evento.key}-nombre`}
                                    name={`dias[${i}].eventos[${j}].nombre`}
                                    required
                                    maxLength={200}
                                    placeholder="Pasacalles, verbena…"
                                    value={evento.nombre}
                                    onChange={(e) =>
                                      updateEvento(dia.key, evento.key, {
                                        nombre: e.target.value,
                                      })
                                    }
                                    onKeyDown={preventEnterSubmit}
                                    readOnly={isPending}
                                    aria-invalid={nErrors.length > 0}
                                  />
                                  {nErrors.length > 0 && (
                                    <div>
                                      {nErrors.map((m, k) => (
                                        <p
                                          key={k}
                                          className="text-sm text-destructive"
                                        >
                                          {m}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor={`ev-${evento.key}-horaInicio`}>
                                    Hora de inicio *
                                  </Label>
                                  <Input
                                    type="time"
                                    id={`ev-${evento.key}-horaInicio`}
                                    required
                                    value={evento.horaInicio}
                                    onChange={(e) =>
                                      updateEvento(dia.key, evento.key, {
                                        horaInicio: e.target.value,
                                      })
                                    }
                                    readOnly={isPending}
                                    aria-invalid={fErrors.length > 0}
                                    className="max-w-60"
                                  />
                                  <p className="text-xs text-muted-foreground">
                                    {dia.fecha.trim() !== ""
                                      ? `Fecha del evento: ${formatDiaCorto(dia.fecha)}`
                                      : "El evento tomará la fecha del día."}
                                  </p>
                                  {fErrors.length > 0 && (
                                    <div>
                                      {fErrors.map((m, k) => (
                                        <p
                                          key={k}
                                          className="text-sm text-destructive"
                                        >
                                          {m}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="grid gap-2">
                                  <Label>Descripción *</Label>
                                  <Tiptap
                                    content={evento.descripcion}
                                    onChange={(html) =>
                                      updateEvento(dia.key, evento.key, {
                                        descripcion: html,
                                      })
                                    }
                                    editable={!isPending}
                                  />
                                  <input
                                    type="hidden"
                                    name={`dias[${i}].eventos[${j}].descripcion`}
                                    value={evento.descripcion}
                                    readOnly
                                  />
                                  {dErrors.length > 0 && (
                                    <div>
                                      {dErrors.map((m, k) => (
                                        <p
                                          key={k}
                                          className="text-sm text-destructive"
                                        >
                                          {m}
                                        </p>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </div>
                        );
                      })}

                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isPending}
                          onClick={() => addEvento(dia.key)}
                        >
                          <Plus className="size-4" aria-hidden="true" />
                          Añadir evento
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            );
          })}

          <div>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={addDia}
            >
              <Plus className="size-4" aria-hidden="true" />
              Añadir día
            </Button>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>{isEdit ? "Guardar" : "Crear"}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button
                type="submit"
                form="programacion-form"
                disabled={isPending}
              >
                {isPending
                  ? isEdit
                    ? "Guardando…"
                    : "Creando…"
                  : isEdit
                    ? "Guardar"
                    : "Crear"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
