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
import DeleteTagDialog from "@/components/admin/DeleteTagDialog";
import TagsTableRow from "@/components/admin/TagsTableRow";
import type { TagDto } from "@/types";

type TagsTableProps = {
  tags: TagDto[];
  onDelete: (id: string) => Promise<void>;
};

export default function TagsTable({ tags, onDelete }: TagsTableProps) {
  const [selected, setSelected] = useState<{
    id: string;
    nombre: string;
  } | null>(null);  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Nº noticias</TableHead>
            <TableHead>Creado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tags.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground"
              >
                No hay etiquetas todavía.
              </TableCell>
            </TableRow>
          ) : (
            tags.map((tag) => (
              <TagsTableRow
                key={tag.id}
                tag={tag}
                onSelectDelete={setSelected}
              />
            ))
          )}
        </TableBody>
      </Table>
      <DeleteTagDialog
        open={selected != null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        id={selected?.id ?? ""}
        nombre={selected?.nombre ?? ""}
        onDelete={onDelete}
      />
    </>
  );
}
