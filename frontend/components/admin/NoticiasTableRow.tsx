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
    <TableRow>
      <TableCell>{noticia.titulo}</TableCell>
      <TableCell>{noticia.publicada ? "Publicada" : "Borrador"}</TableCell>
      <TableCell>{formatDateTime(noticia.createdAt)}</TableCell>
      <TableCell>{noticia.createdBy}</TableCell>
      <TableCell>{formatDateTime(noticia.lastModifiedAt)}</TableCell>
      <TableCell>{noticia.lastModifiedBy ?? "-"}</TableCell>
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
      <TableCell className="sticky right-0 bg-background">
        <NoticiaRowActions
          id={noticia.id}
          titulo={noticia.titulo}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
    </TableRow>
  );
}
