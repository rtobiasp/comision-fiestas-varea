"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteNotificacionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  titulo: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteNotificacionDialog({
  open,
  onOpenChange,
  id,
  titulo,
  onDelete,
}: DeleteNotificacionDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar esta notificación?"
      description={`Se eliminará definitivamente «${titulo}». Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar la notificación. Inténtalo de nuevo."
    />
  );
}
