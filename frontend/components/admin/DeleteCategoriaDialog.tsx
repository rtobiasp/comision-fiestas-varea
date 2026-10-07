"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toFormError } from "@/lib/api/form-error";

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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      await onDelete(id);
      onOpenChange(false);
    } catch (e) {
      setError(
        toFormError(e).message ||
          "No se ha podido eliminar la categoría. Inténtalo de nuevo.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (pending) return;
        onOpenChange(next);
        if (!next) setError(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar esta categoría?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará definitivamente «{nombre}». Esta acción no se puede
            deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error != null && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={pending}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {pending ? "Eliminando…" : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
