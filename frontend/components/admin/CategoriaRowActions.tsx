"use client";

import RowActions from "./RowActions";

type CategoriaRowActionsProps = {
  id: string;
  nombre: string;
  onSelectDelete: (categoria: { id: string; nombre: string }) => void;
};

export default function CategoriaRowActions({
  id,
  nombre,
  onSelectDelete,
}: CategoriaRowActionsProps) {
  return (
    <RowActions
      editHref={`/admin/categorias/${id}/editar`}
      item={{ id, label: nombre }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, nombre: item.label })
      }
    />
  );
}
