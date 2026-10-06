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
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      await onDelete(id);
      onOpenChange(false);
    } catch {
      setError("No se ha podido eliminar la notificación. Inténtalo de nuevo.");
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
          <AlertDialogTitle>¿Eliminar esta notificación?</AlertDialogTitle>
          <AlertDialogDescription>
            Se eliminará definitivamente «{titulo}». Esta acción no se puede
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
