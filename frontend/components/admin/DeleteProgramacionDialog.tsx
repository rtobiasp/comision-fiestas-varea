"use client";

import ConfirmDeleteDialog from "./ConfirmDeleteDialog";

type DeleteProgramacionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  nombre: string;
  onDelete: (id: string) => Promise<void>;
};

export default function DeleteProgramacionDialog({
  open,
  onOpenChange,
  id,
  nombre,
  onDelete,
}: DeleteProgramacionDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={open}
      onOpenChange={onOpenChange}
      title="¿Eliminar esta programación?"
      description={`Se eliminará definitivamente «${nombre}» con todos sus días y eventos. Esta acción no se puede deshacer.`}
      id={id}
      onDelete={onDelete}
      fallbackMessage="No se ha podido eliminar la programación. Inténtalo de nuevo."
    />
  );
}
