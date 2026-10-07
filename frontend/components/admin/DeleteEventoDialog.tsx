"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteEventoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  titulo: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteEventoDialog({
  open,
  onOpenChange,
  id,
  titulo,
  onDelete,
}: DeleteEventoDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar este evento?"
      description={`Se eliminará definitivamente «${titulo}». Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar el evento. Inténtalo de nuevo."
    />
  );
}
