"use client";

import RowActions from "./RowActions";

type EventoRowActionsProps = {
  id: string;
  titulo: string;
  onSelectDelete: (evento: { id: string; titulo: string }) => void;
};

export default function EventoRowActions({
  id,
  titulo,
  onSelectDelete,
}: EventoRowActionsProps) {
  return (
    <RowActions
      editHref={`/admin/eventos/${id}/editar`}
      item={{ id, label: titulo }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, titulo: item.label })
      }
    />
  );
}
