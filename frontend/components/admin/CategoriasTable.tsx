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
import DeleteCategoriaDialog from "@/components/admin/DeleteCategoriaDialog";
import CategoriasTableRow from "@/components/admin/CategoriasTableRow";
import type { CategoriaDto } from "@/types";

type CategoriasTableProps = {
  categorias: CategoriaDto[];
  onDelete: (id: string) => Promise<void>;
};

export default function CategoriasTable({
  categorias,
  onDelete,
}: CategoriasTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    nombre: string;
  } | null>(null);
  const nombresPorId = new Map(categorias.map((c) => [c.id, c.nombre]));
  const selectedId = selected?.id ?? "";
  const selectedNombre = selected?.nombre ?? "";

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Padre</TableHead>
            <TableHead>Nº noticias</TableHead>
            <TableHead>Creada</TableHead>
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
