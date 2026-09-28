import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { NoticiaDto } from "@/types";
import NoticiaRowActions from "@/components/admin/NoticiaRowActions";

type NoticiasTableProps = {
  noticias: NoticiaDto[];
  onDelete: (id: string) => Promise<void>;
};

export default function NoticiasTable({
  noticias,
  onDelete,
}: NoticiasTableProps) {
  return (
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
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {noticias.map((n) => (
          <TableRow key={n.id}>
            <TableCell>{n.titulo}</TableCell>
            <TableCell>{n.publicada ? "Publicada" : "Borrador"}</TableCell>
            <TableCell>
              {new Date(n.createdAt).toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </TableCell>
            <TableCell>{n.createdBy}</TableCell>
            <TableCell>
              {n.lastModifiedAt != null
                ? new Date(n.lastModifiedAt).toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "-"}
            </TableCell>
            <TableCell>
              {n.lastModifiedBy != null ? n.lastModifiedBy : "-"}
            </TableCell>
            <TableCell>
              {n.categorias.length > 0
                ? n.categorias.map((c) => c.nombre).join(", ")
                : "—"}
            </TableCell>
            <TableCell>
              {n.tags.length > 0 ? n.tags.map((t) => t.nombre).join(", ") : "—"}
            </TableCell>
            <TableCell>
              <NoticiaRowActions
                id={n.id}
                titulo={n.titulo}
                onDelete={onDelete}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
