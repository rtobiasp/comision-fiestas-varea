import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import CategoriaRowActions from "@/components/admin/CategoriaRowActions";
import { formatDateTime } from "@/lib/format";
import type { CategoriaDto } from "@/types";

type CategoriasTableRowProps = {
  categoria: CategoriaDto;
  padreNombre: string | null;
  onSelectDelete: (categoria: { id: string; nombre: string }) => void;
};

export default function CategoriasTableRow({
  categoria,
  padreNombre,
  onSelectDelete,
}: CategoriasTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell>
        <Link
          href={`/admin/categorias/${categoria.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {categoria.nombre}
        </Link>
        <CategoriaRowActions
          id={categoria.id}
          nombre={categoria.nombre}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>{categoria.descripcion || "—"}</TableCell>
      <TableCell>{padreNombre ?? "—"}</TableCell>
      <TableCell>{String(categoria.noticiasCount)}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">
          {formatDateTime(categoria.createdAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
