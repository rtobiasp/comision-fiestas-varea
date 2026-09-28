"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Copy,
  Eye,
  MoreHorizontalIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import DeleteNoticiaDialog from "@/components/admin/DeleteNoticiaDialog";

type NoticiaRowActionsProps = {
  id: string;
  titulo: string;
  onDelete: (id: string) => Promise<void>;
};

export default function NoticiaRowActions({
  id,
  titulo,
  onDelete,
}: NoticiaRowActionsProps) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Abrir menú</span>
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem render={<Link href={`/admin/noticias/${id}/editar`} />}>
            <Pencil />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Copy />
            Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/noticias/${id}`} />}>
            <Eye />
            Ver
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteNoticiaDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        id={id}
        titulo={titulo}
        onDelete={onDelete}
      />
    </>
  );
}
