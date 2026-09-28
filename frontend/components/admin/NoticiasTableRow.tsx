import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import NoticiaRowActions from "@/components/admin/NoticiaRowActions";
import { formatDateTime } from "@/lib/format";
import type { NoticiaDto } from "@/types";

type NoticiasTableRowProps = {
  noticia: NoticiaDto;
  onSelectDelete: (noticia: { id: string; titulo: string }) => void;
};

export default function NoticiasTableRow({
  noticia,
  onSelectDelete,
}: NoticiasTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell>
        <Link
          href={`/admin/noticias/${noticia.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {noticia.titulo}
        </Link>
        {!noticia.publicada && (
          <span className="text-muted-foreground"> — Borrador</span>
        )}
        {noticia.fijada && <span className="text-muted-foreground"> — Fijada</span>}
        <NoticiaRowActions
          id={noticia.id}
          titulo={noticia.titulo}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>{noticia.createdBy}</TableCell>
      <TableCell>
        {noticia.categorias.length > 0
          ? noticia.categorias.map((c) => c.nombre).join(", ")
          : "—"}
      </TableCell>
      <TableCell>
        {noticia.tags.length > 0
          ? noticia.tags.map((t) => t.nombre).join(", ")
          : "—"}
      </TableCell>
      <TableCell>
        {noticia.publicada ? "Publicada" : "Borrador"}
        <br />
        <span className="text-muted-foreground">
          {formatDateTime(noticia.createdAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
