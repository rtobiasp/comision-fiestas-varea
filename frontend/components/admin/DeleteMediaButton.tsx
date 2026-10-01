"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { toFormError } from "@/lib/api/form-error";

type DeleteMediaButtonProps = {
  id: string;
  nombre: string;
  onDelete: (id: string) => Promise<void>;
  onDeleted: () => void;
};

export default function DeleteMediaButton({
  id,
  nombre,
  onDelete,
  onDeleted,
}: DeleteMediaButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setPending(true);
    setError(null);
    try {
      await onDelete(id);
      onDeleted();
    } catch (e) {
      setError(toFormError(e).message);
    } finally {
      setPending(false);
    }
  }

  function handleCancel() {
    setConfirming(false);
    setError(null);
  }

  if (!confirming) {
    return (
      <DialogFooter>
        <Button variant="destructive" onClick={() => setConfirming(true)}>
          Eliminar
        </Button>
      </DialogFooter>
    );
  }

  return (
    <DialogFooter className="flex-col items-stretch">
      <p className="text-sm">
        ¿Eliminar «{nombre}»? Esta acción no se puede deshacer.
      </p>
      {error != null && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="flex justify-end gap-2">
        <Button variant="outline" disabled={pending} onClick={handleCancel}>
          Cancelar
        </Button>
        <Button variant="destructive" disabled={pending} onClick={handleConfirm}>
          {pending ? "Eliminando…" : "Sí, eliminar"}
        </Button>
      </div>
    </DialogFooter>
  );
}
