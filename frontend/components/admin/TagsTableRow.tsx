import Link from "next/link";
import { TableCell, TableRow } from "@/components/ui/table";
import TagRowActions from "@/components/admin/TagRowActions";
import { formatDateTime } from "@/lib/format";
import type { TagDto } from "@/types";

type TagsTableRowProps = {
  tag: TagDto;
  onSelectDelete: (tag: { id: string; nombre: string }) => void;
};

export default function TagsTableRow({ tag, onSelectDelete }: TagsTableRowProps) {
  return (
    <TableRow className="group">
      <TableCell className="whitespace-normal">
        <Link
          href={`/admin/tags/${tag.id}/editar`}
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          {tag.nombre}
        </Link>
        <TagRowActions
          id={tag.id}
          nombre={tag.nombre}
          onSelectDelete={onSelectDelete}
        />
      </TableCell>
      <TableCell>{String(tag.noticiasCount)}</TableCell>
      <TableCell>
        <span className="text-muted-foreground">
          {formatDateTime(tag.createdAt)}
        </span>
      </TableCell>
    </TableRow>
  );
}
