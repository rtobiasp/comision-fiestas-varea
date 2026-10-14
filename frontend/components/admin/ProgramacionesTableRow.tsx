import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import ProgramacionRowActions from "@/components/admin/ProgramacionRowActions";
import { formatDateTime } from "@/lib/format";
import type { ProgramacionDto } from "@/types";

type ProgramacionesTableRowProps = {
  programacion: ProgramacionDto;
  onSelectDelete: (item: { id: string; nombre: string }) => void;
};

export default function ProgramacionesTableRow({
  programacion,
  onSelectDelete,
}: ProgramacionesTableRowProps) {
  const diasCount = programacion.dias.length;
  const eventosCount = programacion.dias.reduce(
    (acc, dia) => acc + dia.eventos.length,
    0,
  );
  return (
    <TableRow className="group">
      <TableCell className="whitespace-normal">
        <Link
          href={`/admin/programaciones/${programacion.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {programacion.nombre}
        </Link>
        <ProgramacionRowActions
          id={programacion.id}
          nombre={programacion.nombre}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>{diasCount}</TableCell>
      <TableCell>{eventosCount}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">
          {formatDateTime(
            programacion.lastModifiedAt ?? programacion.createdAt,
          )}
        </span>
      </TableCell>
    </TableRow>
  );
}
