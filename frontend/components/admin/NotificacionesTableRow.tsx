import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import NotificacionRowActions from "@/components/admin/NotificacionRowActions";
import { formatDateTime } from "@/lib/format";
import type { NotificacionDto } from "@/types";

type NotificacionesTableRowProps = {
  notificacion: NotificacionDto;
  onSelectDelete: (notificacion: { id: string; titulo: string }) => void;
};

function nivelClassName(nivel: string): string {
  switch (nivel) {
    case "Info":
      return "border-sky-200 bg-sky-100 text-sky-800 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-200";
    case "Aviso":
      return "border-amber-200 bg-amber-100 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200";
    case "Urgente":
      return "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-950 dark:text-red-200";
    default:
      return "";
  }
}

export default function NotificacionesTableRow({
  notificacion,
  onSelectDelete,
}: NotificacionesTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell>
        <Link
          href={`/admin/notificaciones/${notificacion.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {notificacion.titulo}
        </Link>
        {!notificacion.publicada && (
          <span className="text-muted-foreground"> — Borrador</span>
        )}
        {notificacion.fijada && (
          <span className="text-muted-foreground"> — Fijada</span>
        )}
        <NotificacionRowActions
          id={notificacion.id}
          titulo={notificacion.titulo}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>
        <Badge variant="outline" className={nivelClassName(notificacion.nivel)}>
          {notificacion.nivel}
        </Badge>
      </TableCell>
      <TableCell>{notificacion.createdBy}</TableCell>
      <TableCell>
        {notificacion.categorias.length > 0
          ? notificacion.categorias.map((c) => c.nombre).join(", ")
          : "—"}
      </TableCell>
      <TableCell>
        {notificacion.tags.length > 0
          ? notificacion.tags.map((t) => t.nombre).join(", ")
          : "—"}
      </TableCell>
      <TableCell>
        {notificacion.publicada ? "Publicada" : "Borrador"}
        <br />
        <span className="text-muted-foreground">
          {formatDateTime(
            notificacion.lastModifiedAt ?? notificacion.createdAt,
          )}
        </span>
        {notificacion.fechaCaducidad != null && (
          <>
            <br />
            <span className="text-muted-foreground">
              Caduca: {formatDateTime(notificacion.fechaCaducidad)}
            </span>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
