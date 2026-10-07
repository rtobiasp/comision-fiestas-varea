"use client";

import { useActionState, useId, useRef, useState } from "react";
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

type CreateNombreDialogProps<T> = {
  title: string;
  onCreate: (formData: FormData) => T | Promise<T>;
  disabled?: boolean;
};

export function CreateNombreDialog<T>({
  title,
  onCreate,
  disabled = false,
}: CreateNombreDialogProps<T>) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const baseId = useId();
  const inputId = `${baseId}-nombre`;
  const errorId = `${baseId}-nombre-error`;

  const [, formAction, isPending] = useActionState(
    async (_prev: null, formData: FormData): Promise<null> => {
      setError(null);
      try {
        await onCreate(formData);
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
      <DialogTrigger render={<Button disabled={disabled}>Crear</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <FieldGroup>
            <Field>
              <Label htmlFor={inputId}>Nombre</Label>
              <Input
                id={inputId}
                name="nombre"
                required
                disabled={isPending}
                aria-invalid={error !== null}
                aria-describedby={error ? errorId : undefined}
                onChange={() => {
                  if (error) setError(null);
                }}
              />
              {error && (
                <p
                  id={errorId}
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
