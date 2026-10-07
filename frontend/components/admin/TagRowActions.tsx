"use client";

import RowActions from "./RowActions";

type TagRowActionsProps = {
  id: string;
  nombre: string;
  onSelectDelete: (tag: { id: string; nombre: string }) => void;
};

export default function TagRowActions({
  id,
  nombre,
  onSelectDelete,
}: TagRowActionsProps) {
  return (
    <RowActions
      editHref={`/admin/tags/${id}/editar`}
      item={{ id, label: nombre }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, nombre: item.label })
      }
    />
  );
}
