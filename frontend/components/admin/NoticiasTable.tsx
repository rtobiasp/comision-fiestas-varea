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
            <TableHead className="w-25">Titulo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha creación</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Última modificación</TableHead>
            <TableHead>Modificado por</TableHead>
            <TableHead>Categorias</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="sticky right-0 bg-background">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {noticias.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No hay noticias todavía.
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
