"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteTagDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  nombre: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteTagDialog({
  open,
  onOpenChange,
  id,
  nombre,
  onDelete,
}: DeleteTagDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar esta etiqueta?"
      description={`Se eliminará definitivamente «${nombre}». Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar la etiqueta. Inténtalo de nuevo."
    />
  );
}
