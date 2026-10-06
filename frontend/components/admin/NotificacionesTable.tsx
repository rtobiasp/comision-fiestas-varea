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
import DeleteNotificacionDialog from "@/components/admin/DeleteNotificacionDialog";
import NotificacionesTableRow from "@/components/admin/NotificacionesTableRow";
import type { NotificacionDto } from "@/types";

type NotificacionesTableProps = {
  notificaciones: NotificacionDto[];
  onDelete: (id: string) => Promise<void>;
};

export default function NotificacionesTable({
  notificaciones,
  onDelete,
}: NotificacionesTableProps) {
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
            <TableHead>Nivel</TableHead>
            <TableHead>Autor</TableHead>
            <TableHead>Categorías</TableHead>
            <TableHead>Etiquetas</TableHead>
            <TableHead>Fecha</TableHead>
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
      {selected != null && (
        <DeleteNotificacionDialog
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
