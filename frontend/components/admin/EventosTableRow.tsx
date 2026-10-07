import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import EventoRowActions from "@/components/admin/EventoRowActions";
import { formatDateTime } from "@/lib/format";
import type { EventoDto } from "@/types";

type EventosTableRowProps = {
  evento: EventoDto;
  onSelectDelete: (evento: { id: string; titulo: string }) => void;
};

export default function EventosTableRow({
  evento,
  onSelectDelete,
}: EventosTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell className="whitespace-normal">
        <Link
          href={`/admin/eventos/${evento.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {evento.titulo}
        </Link>
        {!evento.publicada && (
          <span className="text-muted-foreground"> — Borrador</span>
        )}
        {evento.fijada && <span className="text-muted-foreground"> — Fijado</span>}
        <EventoRowActions
          id={evento.id}
          titulo={evento.titulo}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>{evento.lugar}</TableCell>
      <TableCell>
        {formatDateTime(evento.fechaInicio)}
        {evento.fechaFin && (
          <>
            <br />
            <span className="text-muted-foreground">
              {formatDateTime(evento.fechaFin)}
            </span>
          </>
        )}
      </TableCell>
      <TableCell>{evento.createdBy}</TableCell>
      <TableCell>
        {evento.categorias.length > 0
          ? evento.categorias.map((c) => c.nombre).join(", ")
          : "—"}
      </TableCell>
      <TableCell>
        {evento.publicada ? "Publicado" : "Borrador"}
        <br />
        <span className="text-muted-foreground">
          {formatDateTime(evento.lastModifiedAt ?? evento.createdAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
