"use client";

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

type NoticiaRowActionsProps = {
  id: string;
  titulo: string;
  onSelectDelete: (noticia: { id: string; titulo: string }) => void;
};

export default function NoticiaRowActions({
  id,
  titulo,
  onSelectDelete,
}: NoticiaRowActionsProps) {
  return (
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
          onClick={() => onSelectDelete({ id, titulo })}
        >
          <Trash2 />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
