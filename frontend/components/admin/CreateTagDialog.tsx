"use client";

import { useActionState, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormError } from "@/lib/api/form-error";
import { TagDto } from "@/types";

type CreateTagDialogProps = {
  onCreateTag: (formData: FormData) => TagDto | Promise<TagDto>;
};

export function CreateTagDialog({ onCreateTag }: CreateTagDialogProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Igual que en categorías: `useActionState` solo por `isPending`.
  // Estado del hook siempre `null`; el error vive en `useState`.
  const [, formAction, isPending] = useActionState(
    async (_prev: null, formData: FormData): Promise<null> => {
      setError(null);
      try {
        await onCreateTag(formData);
        formRef.current?.reset();
        setOpen(false);
      } catch (e) {
        setError(toFormError(e).message);
      }
      return null;
    },
    null,
  );

  function handleOpenChange(v: boolean) {
    setOpen(v);
    if (v) setError(null);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button>Crear</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nueva etiqueta</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <FieldGroup>
            <Field>
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                required
                disabled={isPending}
                aria-invalid={error !== null}
                aria-describedby={error ? "tag-error" : undefined}
                onChange={() => {
                  if (error) setError(null);
                }}
              />
              {error && (
                <p
                  id="tag-error"
                  role="alert"
                  className="text-sm text-destructive"
                >
                  {error}
                </p>
              )}
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose
              render={<Button variant="outline">Cancelar</Button>}
              disabled={isPending}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creando…" : "Crear"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
