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
import DeleteCategoriaDialog from "@/components/admin/DeleteCategoriaDialog";
import CategoriasTableRow from "@/components/admin/CategoriasTableRow";
import { withParams } from "@/components/admin/table-helpers";
import type { CategoriaDto } from "@/types";

type CategoriasTableProps = {
  categorias: CategoriaDto[];
  orderBy: string;
  direction: string;
  onDelete: (id: string) => Promise<void>;
};

export default function CategoriasTable({
  categorias,
  orderBy,
  direction,
  onDelete,
}: CategoriasTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const nombresPorId = new Map(categorias.map((c) => [c.id, c.nombre]));
  const selectedId = selected?.id ?? "";
  const selectedNombre = selected?.nombre ?? "";
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const base = searchParams.toString();
  const tituloSorted = orderBy === "titulo";
  const fechaSorted = orderBy === "fecha";
  const tituloNext = tituloSorted && direction === "asc" ? "desc" : "asc";
  const fechaNext = fechaSorted && direction === "desc" ? "asc" : "desc";

  return (
    <>
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
                Nombre
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
            <TableHead>Descripción</TableHead>
            <TableHead>Padre</TableHead>
            <TableHead>Nº noticias</TableHead>
            <TableHead aria-sort={fechaSorted ? (direction === "asc" ? "ascending" : "descending") : "none"}>
              <Link
                href={withParams(base, pathname, {
                  orderBy: "fecha",
                  direction: fechaNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Creada
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
          {categorias.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No hay categorías todavía.
              </TableCell>
            </TableRow>
          ) : (
            categorias.map((categoria) => (
              <CategoriasTableRow
                key={categoria.id}
                categoria={categoria}
                padreNombre={
                  categoria.categoriaPadreId
                    ? (nombresPorId.get(categoria.categoriaPadreId) ?? "—")
                    : null
                }
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteCategoriaDialog
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        id={selectedId}
        nombre={selectedNombre}
        onDelete={onDelete}
      />
    </>
  );
}
