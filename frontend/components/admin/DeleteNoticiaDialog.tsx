"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteNoticiaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  titulo: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteNoticiaDialog({
  open,
  onOpenChange,
  id,
  titulo,
  onDelete,
}: DeleteNoticiaDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar esta noticia?"
      description={`Se eliminará definitivamente «${titulo}». Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar la noticia. Inténtalo de nuevo."
    />
  );
}
