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
import DeleteTagDialog from "@/components/admin/DeleteTagDialog";
import TagsTableRow from "@/components/admin/TagsTableRow";
import { withParams } from "@/components/admin/table-helpers";
import type { TagDto } from "@/types";

type TagsTableProps = {
  tags: TagDto[];
  orderBy: string;
  direction: string;
  onDelete: (id: string) => Promise<void>;
};

export default function TagsTable({
  tags,
  orderBy,
  direction,
  onDelete,
}: TagsTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
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
            <TableHead>Nº noticias</TableHead>
            <TableHead aria-sort={fechaSorted ? (direction === "asc" ? "ascending" : "descending") : "none"}>
              <Link
                href={withParams(base, pathname, {
                  orderBy: "fecha",
                  direction: fechaNext,
                })}
                className="group inline-flex items-center gap-1 hover:underline"
              >
                Creado
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
          {tags.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No hay etiquetas todavía.
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TagsTableRow
                key={tag.id}
                tag={tag}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteTagDialog
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
