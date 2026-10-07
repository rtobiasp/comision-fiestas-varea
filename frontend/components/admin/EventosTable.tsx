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
import DeleteEventoDialog from "@/components/admin/DeleteEventoDialog";
import EventosTableRow from "@/components/admin/EventosTableRow";
import { estadoLinkClass, withParams } from "@/components/admin/table-helpers";
import type { EventoDto } from "@/types";

type EventosTableProps = {
  eventos: EventoDto[];
  orderBy: string;
  direction: string;
  publicada?: boolean;
  onDelete: (id: string) => Promise<void>;
};

export default function EventosTable({
  eventos,
  orderBy,
  direction,
  publicada,
  onDelete,
}: EventosTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    titulo: string;
  } | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = searchParams.toString();

  const tituloSorted = orderBy === "titulo";
  const fechaSorted = orderBy === "fecha";
  const tituloNext = tituloSorted && direction === "asc" ? "desc" : "asc";
  const fechaNext = fechaSorted && direction === "desc" ? "asc" : "desc";

  const estadoLink = estadoLinkClass;

  return (
    <>
      <div className="flex items-center gap-2 text-sm">
        <Link
          href={withParams(base, pathname, { publicada: null })}
          aria-current={publicada === undefined ? "page" : undefined}
          className={estadoLink(publicada === undefined)}
        >
          Todos
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">
          |
        </span>
        <Link
          href={withParams(base, pathname, { publicada: "true" })}
          aria-current={publicada === true ? "page" : undefined}
          className={estadoLink(publicada === true)}
        >
          Publicados
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">
          |
        </span>
        <Link
          href={withParams(base, pathname, { publicada: "false" })}
          aria-current={publicada === false ? "page" : undefined}
          className={estadoLink(publicada === false)}
        >
          Borradores
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead aria-sort={tituloSorted ? (direction === "asc" ? "ascending" : "descending") : "none"}>
              <Link
                href={withParams(base, pathname, {
                  orderBy: "titulo",
                  direction: tituloNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Título
                {tituloSorted ? (
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
            <TableHead>Lugar</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead aria-sort={fechaSorted ? (direction === "asc" ? "ascending" : "descending") : "none"}>
              <Link
                href={withParams(base, pathname, {
                  orderBy: "fecha",
                  direction: fechaNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Estado
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
          {eventos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay eventos todavía.
              </TableCell>
            </TableRow>
          ) : (
            eventos.map((evento) => (
              <EventosTableRow
                key={evento.id}
                evento={evento}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteEventoDialog
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        id={selected?.id ?? ""}
        titulo={selected?.titulo ?? ""}
        onDelete={onDelete}
      />
    </>
  );
}
