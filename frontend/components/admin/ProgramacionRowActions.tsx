"use client";

import RowActions from "./RowActions";

type ProgramacionRowActionsProps = {
  id: string;
  nombre: string;
  onSelectDelete: (item: { id: string; nombre: string }) => void;
};

export default function ProgramacionRowActions({
  id,
  nombre,
  onSelectDelete,
}: ProgramacionRowActionsProps) {
  return (
    <RowActions
      editHref={`/admin/programaciones/${id}/editar`}
      item={{ id, label: nombre }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, nombre: item.label })
      }
    />
  );
}
