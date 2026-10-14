"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteProgramacionDialog from "@/components/admin/DeleteProgramacionDialog";
import ProgramacionesTableRow from "@/components/admin/ProgramacionesTableRow";
import { withParams } from "@/components/admin/table-helpers";
import type { ProgramacionDto } from "@/types";

type ProgramacionesTableProps = {
  programaciones: ProgramacionDto[];
  orderBy: string;
  direction: string;
  onDelete: (id: string) => Promise<void>;
};

export default function ProgramacionesTable({
  programaciones,
  orderBy,
  direction,
  onDelete,
}: ProgramacionesTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = searchParams.toString();

  const nombreSorted = orderBy === "nombre";
  const fechaSorted = orderBy === "fecha";
  const nombreNext = nombreSorted && direction === "asc" ? "desc" : "asc";
  const fechaNext = fechaSorted && direction === "desc" ? "asc" : "desc";

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              aria-sort={
                nombreSorted
                  ? direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <Link
                href={withParams(base, pathname, {
                  orderBy: "nombre",
                  direction: nombreNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Nombre
                {nombreSorted ? (
                  direction === "asc" ? (
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDown
                    className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </TableHead>
            <TableHead>Días</TableHead>
            <TableHead>Eventos</TableHead>
            <TableHead
              aria-sort={
                fechaSorted
                  ? direction === "asc"
                    ? "ascending"
                    : "descending"
                  : "none"
              }
            >
              <Link
                href={withParams(base, pathname, {
                  orderBy: "fecha",
                  direction: fechaNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Fecha
                {fechaSorted ? (
                  direction === "asc" ? (
                    <ArrowUp className="size-3.5" aria-hidden="true" />
                  ) : (
                    <ArrowDown className="size-3.5" aria-hidden="true" />
                  )
                ) : (
                  <ArrowUpDown
                    className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60"
                    aria-hidden="true"
                  />
                )}
              </Link>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programaciones.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No hay programaciones todavía.
              </TableCell>
            </TableRow>
          ) : (
            programaciones.map((programacion) => (
              <ProgramacionesTableRow
                key={programacion.id}
                programacion={programacion}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteProgramacionDialog
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        id={selected?.id ?? ""}
        nombre={selected?.nombre ?? ""}
        onDelete={onDelete}
      />
    </>
  );
}
