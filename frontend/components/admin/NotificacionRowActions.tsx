"use client";

import Link from "next/link";

type NotificacionRowActionsProps = {
  id: string;
  titulo: string;
  onSelectDelete: (notificacion: { id: string; titulo: string }) => void;
};

export default function NotificacionRowActions({
  id,
  titulo,
  onSelectDelete,
}: NotificacionRowActionsProps) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-1 text-[0.8rem] md:opacity-0 md:transition-opacity md:group-hover:opacity-100 md:group-focus-within:opacity-100">
      <Link
        href={`/admin/notificaciones/${id}/editar`}
        className="text-primary underline-offset-4 hover:underline"
      >
        Editar
      </Link>
      <span aria-hidden="true" className="text-muted-foreground">
        |
      </span>
      <Link
        href={`/admin/notificaciones/${id}`}
        className="text-primary underline-offset-4 hover:underline"
      >
        Ver
      </Link>
      <span aria-hidden="true" className="text-muted-foreground">
        |
      </span>
      <button
        type="button"
        onClick={() => onSelectDelete({ id, titulo })}
        className="cursor-pointer text-destructive underline-offset-4 hover:underline"
      >
        Papelera
      </button>
    </div>
  );
}
