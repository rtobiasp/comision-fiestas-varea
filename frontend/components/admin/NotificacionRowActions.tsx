"use client";

import RowActions from "./RowActions";

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
    <RowActions
      editHref={`/admin/notificaciones/${id}/editar`}
      item={{ id, label: titulo }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, titulo: item.label })
      }
    />
  );
}
