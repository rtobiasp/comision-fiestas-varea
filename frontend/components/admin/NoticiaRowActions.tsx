"use client";

import RowActions from "./RowActions";

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
    <RowActions
      editHref={`/admin/noticias/${id}/editar`}
      viewHref={`/noticias/${id}`}
      item={{ id, label: titulo }}
      onSelectDelete={(item) =>
        onSelectDelete({ id: item.id, titulo: item.label })
      }
    />
  );
}
