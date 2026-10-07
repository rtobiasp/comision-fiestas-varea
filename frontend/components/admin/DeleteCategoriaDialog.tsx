"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteCategoriaDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  nombre: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteCategoriaDialog({
  open,
  onOpenChange,
  id,
  nombre,
  onDelete,
}: DeleteCategoriaDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar esta categoría?"
      description={`Se eliminará definitivamente «${nombre}». Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar la categoría. Inténtalo de nuevo."
    />
  );
}
