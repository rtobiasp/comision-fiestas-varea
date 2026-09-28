"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DeleteNoticiaDialog from "@/components/admin/DeleteNoticiaDialog";
import NoticiasTableRow from "@/components/admin/NoticiasTableRow";
import type { NoticiaDto } from "@/types";

type NoticiasTableProps = {
  noticias: NoticiaDto[];
  onDelete: (id: string) => Promise<void>;
};

export default function NoticiasTable({
  noticias,
  onDelete,
}: NoticiasTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    titulo: string;
  } | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noticias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-muted-foreground">
                No hay entradas todavía.
              </TableCell>
            </TableRow>
          ) : (
            noticias.map((noticia) => (
              <NoticiasTableRow
                key={noticia.id}
                noticia={noticia}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      {selected != null && (
        <DeleteNoticiaDialog
          open={selected != null}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          id={selected.id}
          titulo={selected.titulo}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
