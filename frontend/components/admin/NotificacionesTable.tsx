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
import DeleteNotificacionDialog from "@/components/admin/DeleteNotificacionDialog";
import NotificacionesTableRow from "@/components/admin/NotificacionesTableRow";
import { estadoLinkClass, withParams } from "@/components/admin/table-helpers";
import type { NotificacionDto } from "@/types";

type NotificacionesTableProps = {
  notificaciones: NotificacionDto[];
  orderBy: string;
  direction: string;
  publicada?: boolean;
  onDelete: (id: string) => Promise<void>;
};

export default function NotificacionesTable({
  notificaciones,
  orderBy,
  direction,
  publicada,
  onDelete,
}: NotificacionesTableProps) {
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
          Todas
        </Link>
        <span aria-hidden="true" className="text-muted-foreground">
          |
        </span>
        <Link
          href={withParams(base, pathname, { publicada: "true" })}
          aria-current={publicada === true ? "page" : undefined}
          className={estadoLink(publicada === true)}
        >
          Publicadas
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
            <TableHead>Nivel</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead aria-sort={fechaSorted ? (direction === "asc" ? "ascending" : "descending") : "none"}>
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
          {notificaciones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No hay notificaciones todavía.
              </TableCell>
            </TableRow>
          ) : (
            notificaciones.map((notificacion) => (
              <NotificacionesTableRow
                key={notificacion.id}
                notificacion={notificacion}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteNotificacionDialog
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
